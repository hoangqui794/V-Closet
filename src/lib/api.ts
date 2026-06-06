export const BASE_URL = import.meta.env.VITE_API_URL || "https://api.vcloset.vn";

export function getToken(): string | null {
    return localStorage.getItem("accessToken");
}

export function setToken(token: string) {
    localStorage.setItem("accessToken", token);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
}

export function setRefreshToken(token: string) {
    localStorage.setItem("refreshToken", token);
}

export function clearToken() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
    const accessToken = getToken();
    const refreshToken = getRefreshToken();
    if (!accessToken || !refreshToken) {
        return null;
    }

    try {
        console.debug("[API] Calling refresh token endpoint...");
        const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                accessToken,
                refreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error(`Refresh failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.accessToken && data.refreshToken) {
            console.debug("[API] Token refreshed successfully.");
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            return data.accessToken;
        }
        return null;
    } catch (error) {
        console.error("[API] Failed to refresh token:", error);
        clearToken();
        return null;
    }
}

async function getOrRefreshPromise(): Promise<string | null> {
    if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const hdrs = new Headers(options.headers as HeadersInit);
    if (options.body instanceof FormData) {
        hdrs.delete("Content-Type");
    } else if (!hdrs.has("Content-Type")) {
        hdrs.set("Content-Type", "application/json");
    }
    if (!hdrs.has("Accept")) hdrs.set("Accept", "application/json");
    if (token && !hdrs.has("Authorization")) hdrs.set("Authorization", `Bearer ${token}`);

    console.debug("[API] Request", { url: `${BASE_URL}${path}`, method: options.method ?? "GET", hasToken: !!token });
    // Log headers we will send (helpful to confirm Authorization present)
    try {
        console.debug("[API] Request headers", { Authorization: hdrs.get("Authorization"), "Content-Type": hdrs.get("Content-Type") });
    } catch (e) {
        // ignore logging failures
    }

    let res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: hdrs,
    });

    if (res.status === 401) {
        if (path.includes("/api/auth/login")) {
            // Nhập sai tài khoản/mật khẩu, trả về lỗi bình thường để Form đăng nhập hiển thị lỗi
        } else if (path.includes("/api/auth/refresh-token")) {
            // Khi chính API refresh token trả về 401 (tài khoản đã bị khoá hoặc refresh token hết hạn)
            clearToken();
            if (typeof window !== "undefined") {
                window.location.href = "/?expired=true";
            }
        } else {
            console.debug("[API] 401 Unauthorized detected. Trying to refresh token...");
            const newToken = await getOrRefreshPromise();
            if (newToken) {
                hdrs.set("Authorization", `Bearer ${newToken}`);
                console.debug("[API] Retrying original request with new token...");
                res = await fetch(`${BASE_URL}${path}`, {
                    ...options,
                    headers: hdrs,
                });
                
                // Nếu sau khi thử lại bằng token mới vẫn bị 401 (ví dụ vừa bị ban/thu hồi quyền)
                if (res.status === 401) {
                    clearToken();
                    if (typeof window !== "undefined") {
                        window.location.href = "/?expired=true";
                    }
                }
            } else {
                console.warn("[API] Token refresh unsuccessful, redirecting to login...");
                clearToken();
                if (typeof window !== "undefined") {
                    window.location.href = "/?expired=true";
                }
            }
        }
    }

    if (!res.ok) {
        let errMsg = "";
        
        // Mapped user-friendly Vietnamese messages based on HTTP Status Codes
        switch (res.status) {
            case 400:
                errMsg = "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin gửi đi.";
                break;
            case 401:
                errMsg = "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.";
                break;
            case 403:
                errMsg = "Bạn không có quyền thực hiện hành động này.";
                break;
            case 404:
                errMsg = "Không tìm thấy dữ liệu yêu cầu trên hệ thống.";
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                errMsg = "Hệ thống máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút.";
                break;
            default:
                errMsg = `Đã xảy ra sự cố kết nối (Mã lỗi: HTTP ${res.status})`;
        }

        try {
            const txt = await res.text();
            if (txt) {
                try {
                    const data = JSON.parse(txt);
                    if (data?.errors && typeof data.errors === "object") {
                        const errorList = Object.values(data.errors).flat();
                        if (errorList.length > 0) {
                            errMsg = errorList.join("\n");
                        } else {
                            errMsg = data?.message || data?.title || data?.error || errMsg;
                        }
                    } else if (data?.message || data?.title || data?.error) {
                        errMsg = data.message || data.title || data.error;
                    }
                } catch {
                    if (txt.length < 150) {
                        errMsg = txt;
                    }
                }
            }
        } catch {
            // ignore
        }
        throw new Error(errMsg);
    }

    // Some endpoints return 204 No Content
    if (res.status === 204) return undefined as unknown as T;

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json() as Promise<T>;
    } else {
        const text = await res.text();
        return text as unknown as T;
    }
}


// ─── AdminUsers API ────────────────────────────────────────────────────────────

export interface AdminUser {
    userId: string;
    internalId: number;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    isBanned: boolean;
    activeBanType: string | null;
    bannedUntil: string | null;
    permissions?: string[] | any[];
    country?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    dateOfBirth?: string | null;
    wardrobeItemCount?: number;
    banHistory?: Array<{
        id: string;
        banType: string;
        reason: string;
        bannedUntil: string | null;
        isLifted: boolean;
        liftReason: string | null;
        liftedAt: string | null;
        createdAt: string;
        bannedByDisplayName: string;
    }>;
}

export interface PaginatedUsers {
    users: AdminUser[];      // actual API field
    items: AdminUser[];      // normalized alias for UI
    totalCount: number;      // primary pagination field
    total?: number;          // alias some APIs use
    page: number;
    pageSize: number;
    totalPages: number;      // primary pagination field
    pageCount?: number;      // alias some APIs use
}

export interface GetUsersParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    isBanned?: boolean;
}

export async function getAdminUsers(params: GetUsersParams = {}): Promise<PaginatedUsers> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.search) query.set("search", params.search);
    if (params.role) query.set("role", params.role);
    if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
    if (params.isBanned !== undefined) query.set("isBanned", String(params.isBanned));

    const raw = await request<PaginatedUsers>(`/api/admin/users?${query.toString()}`);
    // DEBUG: log full response shape (remove after confirming)
    console.log("[API] getAdminUsers raw response:", raw);
    // Normalize: API returns 'users', UI expects 'items'
    if (!raw.items && raw.users) {
        raw.items = raw.users;
    }
    return raw;
}

export interface CreateUserPayload {
    email: string;
    displayName: string;
    role: string;
}

export async function createAdminUser(payload: CreateUserPayload): Promise<AdminUser> {
    return request<AdminUser>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getAdminUserDetail(userId: string): Promise<AdminUser> {
    return request<AdminUser>(`/api/admin/users/${userId}`);
}

export async function deactivateAdminUser(userId: string): Promise<void> {
    return request<void>(`/api/admin/users/${userId}`, { method: "DELETE" });
}

export interface BanUserPayload {
    banType: string; // "chat" | "post" | "all"
    reason?: string;
    bannedUntil?: string; // ISO String format
}

export async function banAdminUser(userId: string, payload: BanUserPayload): Promise<void> {
    return request<void>(`/api/admin/users/${userId}/ban`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function unbanAdminUser(userId: string): Promise<void> {
    return request<void>(`/api/admin/users/${userId}/ban`, { method: "DELETE" });
}

export interface GrantPermissionPayload {
    permissionCode: string;
}

export async function grantAdminPermission(userId: string, payload: GrantPermissionPayload): Promise<void> {
    return request<void>(`/api/admin/users/${userId}/permissions`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function revokeAdminPermission(userId: string, permissionCode: string): Promise<void> {
    const query = new URLSearchParams();
    query.set("permissionCode", permissionCode);
    return request<void>(`/api/admin/users/${userId}/permissions?${query.toString()}`, {
        method: "DELETE",
    });
}

export interface UpdateRolePayload {
    newRole: string; // "admin" | "moderator" | "customer" | "brandpartner"
}

export async function updateUserRole(userId: string, payload: UpdateRolePayload): Promise<void> {
    return request<void>(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function reactivateAdminUser(userId: string): Promise<void> {
    return request<void>(`/api/admin/users/${userId}/reactivate`, {
        method: "POST",
    });
}

export async function resetAdminPermissions(userId: string): Promise<void> {
    return request<void>(`/api/admin/users/${userId}/permissions/reset`, {
        method: "POST",
    });
}

// ─── Admin Moderation Reports API ──────────────────────────────────────────────

export interface AdminReport {
    reportId: string;
    postId: string;
    postCaption: string;
    postCreatorDisplayName: string;
    reporterDisplayName: string;
    reason: string;
    description: string;
    isResolved: boolean;
    createdAt: string;
}

export interface PaginatedReports {
    reports: AdminReport[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface GetReportsParams {
    page?: number;
    pageSize?: number;
    isResolved?: boolean;
    reason?: string;
}

export async function getAdminReports(params: GetReportsParams = {}): Promise<PaginatedReports> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.isResolved !== undefined) query.set("isResolved", String(params.isResolved));
    if (params.reason) query.set("reason", params.reason);

    return request<PaginatedReports>(`/api/admin/moderation/reports?${query.toString()}`);
}

export interface ReportedPostDetail {
    postId: string;
    canvasImage: string | null;
    reasons?: string[];
}

export async function getReportedPostDetail(postId: string): Promise<ReportedPostDetail> {
    return request<ReportedPostDetail>(`/api/admin/moderation/posts/${postId}`);
}

export interface ResolveReportPayload {
    action: string; // "hide" | "dismiss"
    resolutionNotes?: string;
}

export async function resolveAdminReport(reportId: string, payload: ResolveReportPayload): Promise<void> {
    return request<void>(`/api/admin/moderation/reports/${reportId}/resolve`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export interface UpdatePostVisibilityPayload {
    isHidden: boolean;
    reason?: string;
}

export async function updatePostVisibility(postId: string, payload: UpdatePostVisibilityPayload): Promise<void> {
    return request<void>(`/api/admin/moderation/posts/${postId}/visibility`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

// ─── Admin Brand Partners API ───────────────────────────────────────────────

export interface BrandPartner {
    brandId: string;
    brandName: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    contactPhone: string | null;
    taxcode: string | null;
    creditBalance: number;
    status: string; // "Pending" | "Verified" | "Suspended"
    createdAt: string;
    userId: string;
    userEmail: string;
    userDisplayName: string;
}

export interface GetBrandsParams {
    status?: string;
    search?: string;
}

export async function getAdminBrands(params: GetBrandsParams = {}): Promise<BrandPartner[]> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);

    return request<BrandPartner[]>(`/api/admin/brands?${query.toString()}`);
}

export interface UpdateBrandStatusPayload {
    status: string; // "Pending" | "Verified" | "Suspended"
    notes?: string;
}

export async function updateBrandStatus(brandId: string, payload: UpdateBrandStatusPayload): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/brands/${brandId}/status`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export interface DepositBrandCreditPayload {
    amount: number;
    description?: string;
}

export async function depositBrandCredit(brandId: string, payload: DepositBrandCreditPayload): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/brands/${brandId}/credit`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    userId: number | string;
    role: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    isOnboardingCompleted: boolean;
    isPasswordSet: boolean;
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
    return request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// ─── Admin Products API ───────────────────────────────────────────────────────

export interface AffiliateProduct {
    id: string;
    shopeeProductId: string | null;
    shopeeShopId: string | null;
    shopeeShopid?: string | null;
    name: string | null;
    description: string | null;
    imageUrl: string | null;
    price: number;
    originalPrice: number | null;
    category: string; // "Top" | "Bottom" | "Dress" | "Outerwear" | "Shoes" | "Bag" | "Accessory" | "Other"
    affiliateLink: string | null;
    trackingCode: string | null;
    isTrending: boolean;
    isActive: boolean;
    clicks?: number;
    canvasTries?: number;
    ctr?: number;
}

export interface PaginatedProducts {
    items: AffiliateProduct[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface GetProductsParams {
    page?: number;
    pageSize?: number;
    category?: string;
    isActive?: boolean;
    search?: string;
}

export interface CreateProductPayload {
    shopeeProductId?: string | null;
    shopeeShopId?: string | null;
    shopeeShopid?: string | null;
    name: string;
    description?: string | null;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
    category: string;
    affiliateLink: string;
    trackingCode?: string | null;
    isTrending: boolean;
    isActive: boolean;
}

export interface UpdateProductPayload {
    name?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    price?: number;
    originalPrice?: number | null;
    category?: string;
    affiliateLink?: string | null;
    isTrending?: boolean;
    isActive?: boolean;
}

export async function getAdminProducts(params: GetProductsParams = {}): Promise<PaginatedProducts> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.category) query.set("category", params.category);
    if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
    if (params.search) query.set("search", params.search);

    const raw = await request<PaginatedProducts>(`/api/admin/products?${query.toString()}`);
    if (raw && raw.items) {
        raw.items = raw.items.map(item => ({
            ...item,
            shopeeShopId: item.shopeeShopId || (item as any).shopeeShopid
        }));
    }
    return raw;
}

export async function createAdminProduct(payload: CreateProductPayload): Promise<AffiliateProduct> {
    const body = {
        ...payload,
        shopeeShopid: payload.shopeeShopid || payload.shopeeShopId
    };
    return request<AffiliateProduct>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function getAdminProductDetail(id: string): Promise<AffiliateProduct> {
    const raw = await request<AffiliateProduct>(`/api/admin/products/${id}`);
    if (raw) {
        raw.shopeeShopId = raw.shopeeShopId || (raw as any).shopeeShopid;
    }
    return raw;
}

export async function updateAdminProduct(id: string, payload: UpdateProductPayload): Promise<AffiliateProduct> {
    return request<AffiliateProduct>(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteAdminProduct(id: string): Promise<void> {
    return request<void>(`/api/admin/products/${id}`, {
        method: "DELETE",
    });
}

export async function importAffiliateConversions(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    return request<void>("/api/admin/products/import-conversions", {
        method: "POST",
        body: formData,
    });
}

export async function removeBgAndUploadProductImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ imageUrl: string }>("/api/admin/products/remove-bg-upload", {
        method: "POST",
        body: formData,
    });
}

export async function logoutAdmin(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
        if (refreshToken) {
            await request<void>("/api/auth/logout", {
                method: "POST",
                body: JSON.stringify({ refreshToken }),
            });
        }
    } catch (err) {
        console.error("[API] Error calling logout endpoint:", err);
    } finally {
        clearToken();
    }
}

export interface ForgotPasswordPayload {
    email: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    return request<string>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export interface ResetPasswordPayload {
    email: string;
    otpCode: string;
    newPassword: string;
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<string> {
    return request<string>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<string> {
    return request<string>("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// ─── Admin Campaigns API ──────────────────────────────────────────────────────

export interface CampaignMetrics {
    activeCampaignsCount: number;
    totalCampaignsCount: number;
    totalDailyBudget: number;
    totalSpent: number;
    totalImpressions: number;
    totalClicks: number;
    overallCtr: number;
}

export async function getAdminCampaignMetrics(): Promise<CampaignMetrics> {
    return request<CampaignMetrics>("/api/admin/campaigns/metrics");
}

export interface SponsoredCampaign {
    campaignId: string;
    brandName: string;
    productName: string;
    productImageUrl: string;
    displayRank: number;
    dailyBudget: number;
    totalSpent: number;
    impressionCount: number;
    clickCount: number;
    isActive: boolean;
    startAt: string;
    endAt: string;
    createdAt: string;
}

export async function getAdminCampaigns(): Promise<SponsoredCampaign[]> {
    return request<SponsoredCampaign[]>("/api/admin/campaigns");
}

export interface CreateCampaignPayload {
    brandId: string;
    productId: string;
    displayRank: number;
    dailyBudget: number;
    startAt: string;
    endAt: string;
}

export async function createAdminCampaign(payload: CreateCampaignPayload): Promise<{ message: string }> {
    return request<{ message: string }>("/api/admin/campaigns", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function stopAdminCampaign(campaignId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/campaigns/${campaignId}/stop`, {
        method: "POST"
    });
}

export async function resumeAdminCampaign(campaignId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/campaigns/${campaignId}/resume`, {
        method: "POST"
    });
}

export interface AdjustCampaignPayload {
    dailyBudget: number;
    displayRank: number;
}

export async function adjustAdminCampaign(campaignId: string, payload: AdjustCampaignPayload): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/campaigns/${campaignId}/adjust`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export interface SearchCampaignsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
}

export interface PaginatedCampaigns {
    campaigns: SponsoredCampaign[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export async function searchAdminCampaigns(params: SearchCampaignsParams = {}): Promise<PaginatedCampaigns> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.search) query.set("search", params.search);
    if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
    return request<PaginatedCampaigns>(`/api/admin/campaigns/search?${query.toString()}`);
}

export async function deleteAdminCampaign(campaignId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/campaigns/${campaignId}`, {
        method: "DELETE",
    });
}

export async function exportAdminCampaigns(): Promise<void> {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/api/admin/campaigns/export`, {
        headers: {
            "Accept": "*/*",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error(`Xuất báo cáo thất bại (HTTP ${res.status})`);

    // Lấy tên file từ header Content-Disposition nếu có
    const disposition = res.headers.get("content-disposition") || "";
    const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/i);
    const filename = match ? decodeURIComponent(match[1]) : "campaigns-report.csv";

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// ─── Admin Permissions API ───────────────────────────────────────────────────

export interface PermissionResponse {
    id: number;
    code: string;
    name: string;
    description: string | null;
    grp: string;
}

export interface AdminUserPermissionResponse {
    userId: string;
    displayName: string;
    email: string;
    roleName: string;
    grantedPermissions: PermissionResponse[];
}

export async function getAdminPermissionsAll(): Promise<PermissionResponse[]> {
    return request<PermissionResponse[]>("/api/admin/permissions/all");
}

export async function getAdminUserPermissions(userId: string): Promise<AdminUserPermissionResponse> {
    return request<AdminUserPermissionResponse>(`/api/admin/permissions/${userId}`);
}

export async function getAdminMyPermissions(): Promise<AdminUserPermissionResponse> {
    return request<AdminUserPermissionResponse>("/api/admin/permissions/me");
}

export interface UpdatePermissionRequestPayload {
    permissionIds: number[];
}

export async function grantAdminUserPermissions(
    userId: string,
    payload: UpdatePermissionRequestPayload
): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/permissions/${userId}/grant`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function revokeAdminUserPermissions(
    userId: string,
    payload: UpdatePermissionRequestPayload
): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/permissions/${userId}/revoke`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function resetAdminUserPermissions(userId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/permissions/${userId}/reset`, {
        method: "POST",
    });
}

// ─── Admin Subscriptions API ──────────────────────────────────────────────────

export interface SubscriptionPlanResponse {
    id: string;
    name: string;
    description: string | null;
    price: number;
    currency: string;
    durationDays: number;
    isActive: boolean;
}

export interface CreateOrUpdatePlanPayload {
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    durationDays: number;
    isActive: boolean;
}

export async function getAdminSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
    return request<SubscriptionPlanResponse[]>("/api/admin/subscriptions/plans");
}

export async function getAdminSubscriptionPlanDetail(id: string): Promise<SubscriptionPlanResponse> {
    return request<SubscriptionPlanResponse>(`/api/admin/subscriptions/plans/${id}`);
}

export async function createAdminSubscriptionPlan(payload: CreateOrUpdatePlanPayload): Promise<SubscriptionPlanResponse> {
    return request<SubscriptionPlanResponse>("/api/admin/subscriptions/plans", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateAdminSubscriptionPlan(
    id: string,
    payload: CreateOrUpdatePlanPayload
): Promise<SubscriptionPlanResponse> {
    return request<SubscriptionPlanResponse>(`/api/admin/subscriptions/plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteAdminSubscriptionPlan(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/admin/subscriptions/plans/${id}`, {
        method: "DELETE",
    });
}

// ─── Admin Dashboard Metrics API ───────────────────────────────────────────────

export interface DashboardMetrics {
    totalUserCount: number;
    pendingBrandCount: number;
    pendingReportCount: number;
    totalSystemAdCredits: number;
    activePremiumSubscriptionCount: number;
    totalPremiumRevenue: number;
}

export async function getAdminDashboardMetrics(): Promise<DashboardMetrics> {
    return request<DashboardMetrics>("/api/admin/dashboard/metrics");
}

export interface RevenueChartItem {
    timeLabel: string;
    revenue: number;
    affiliateCommission: number;
}

export async function getAdminRevenueChart(period: string = "month"): Promise<RevenueChartItem[]> {
    return request<RevenueChartItem[]>(`/api/admin/dashboard/revenue-chart?period=${period}`);
}

export interface RecentSignupItem {
    userId: string;
    displayName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
    createdAt: string;
}

export async function getAdminRecentSignups(limit: number = 5): Promise<RecentSignupItem[]> {
    return request<RecentSignupItem[]>(`/api/admin/dashboard/recent-signups?limit=${limit}`);
}

export interface SystemAlertItem {
    type: string; // "success" | "warning" | "info" | "error"
    message: string;
    createdAt: string;
}

export async function getAdminSystemAlerts(): Promise<SystemAlertItem[]> {
    return request<SystemAlertItem[]>("/api/admin/dashboard/system-alerts");
}

// ─── Admin Manual Payments & Premium Subscriptions APIs ─────────────────────────────────

export interface ManualPaymentListItem {
    transactionId: number;
    transactionGuid: string;
    userId: number;
    userEmail: string;
    userName: string;
    planName: string;
    amount: number;
    currency: string;
    proofImageUrl: string | null;
    userNote: string | null;
    createdAt: string;
}

export interface PremiumSubscriptionListItem {
    subscriptionId: string;
    userId: string;
    email: string;
    displayName: string;
    planName: string;
    planType: string;
    pricePaid: number;
    currency: string;
    paymentMethod: string;
    paymentRef: string;
    startedAt: string;
    expiresAt: string;
    isActive: boolean;
}

export interface PagedPremiumSubscriptionsResponse {
    subscriptions: PremiumSubscriptionListItem[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export async function getAdminPendingManualPayments(): Promise<ManualPaymentListItem[]> {
    return request<ManualPaymentListItem[]>("/api/manual-payments/admin/pending");
}

export async function approveAdminManualPayment(
    transactionId: number,
    body: { adminNote: string | null }
): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/manual-payments/admin/${transactionId}/approve`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function rejectAdminManualPayment(
    transactionId: number,
    body: { adminNote: string | null }
): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/manual-payments/admin/${transactionId}/reject`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export interface GetAdminPremiumSubscriptionsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    planType?: string;
}

export async function getAdminPremiumSubscriptions(
    params: GetAdminPremiumSubscriptionsParams = {}
): Promise<PagedPremiumSubscriptionsResponse> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.search) query.set("search", params.search);
    if (params.isActive !== undefined) query.set("isActive", String(params.isActive));
    if (params.planType) query.set("planType", params.planType);

    return request<PagedPremiumSubscriptionsResponse>(`/api/admin/subscriptions?${query.toString()}`);
}

export async function revokeAdminPremiumSubscription(
    subscriptionId: string,
    body: { adminNote: string | null }
): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/admin/subscriptions/${subscriptionId}/revoke`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

// ─── Admin Subscription Tier Config APIs ─────────────────────────────────

export interface TierConfigResponse {
    tierName: string;
    bgRemovalCredits: number;
    tryOnCredits: number;
    wardrobeItemLimit: number | null;
    outfitLimit: number | null;
    updatedAt: string;
    updatedBy: string | null;
}

export interface UpdateTierConfigRequest {
    bgRemovalCredits: number;
    tryOnCredits: number;
    wardrobeItemLimit: number | null;
    outfitLimit: number | null;
}

export async function getAdminTierConfigs(): Promise<TierConfigResponse[]> {
    return request<TierConfigResponse[]>("/api/admin/tier-config");
}

export async function getAdminTierConfig(tierName: string): Promise<TierConfigResponse> {
    return request<TierConfigResponse>(`/api/admin/tier-config/${tierName}`);
}

export async function updateAdminTierConfig(
    tierName: string,
    payload: UpdateTierConfigRequest
): Promise<TierConfigResponse> {
    return request<TierConfigResponse>(`/api/admin/tier-config/${tierName}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

// ─── Admin Notifications API ──────────────────────────────────────────────────

export interface AdminNotificationItem {
    id: string;
    type: string;
    title: string;
    body: string | null;
    referenceType?: string | null;
    referenceId?: number | null;
    isRead: boolean;
    userInternalId: number;
    createdAt: string;
}

export interface BroadcastNotificationRequest {
    title: string;
    body: string;
    type?: string;
    referenceType?: string | null;
    referenceId?: number | null;
}

export interface SendTargetedNotificationRequest {
    userId: number;
    title: string;
    body: string;
    type?: string;
    referenceType?: string | null;
    referenceId?: number | null;
}

export interface GetAdminNotificationsParams {
    targetUserId?: number;
    type?: string;
    page?: number;
    pageSize?: number;
}

export async function broadcastSystemNotification(payload: BroadcastNotificationRequest): Promise<{ message: string }> {
    return request<{ message: string }>("/api/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function sendTargetedNotification(payload: SendTargetedNotificationRequest): Promise<{ message: string; data?: AdminNotificationItem }> {
    return request<{ message: string; data?: AdminNotificationItem }>("/api/notifications/admin/send-to-user", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getAdminNotifications(params: GetAdminNotificationsParams = {}): Promise<AdminNotificationItem[]> {
    const query = new URLSearchParams();
    if (params.targetUserId !== undefined) query.set("targetUserId", String(params.targetUserId));
    if (params.type) query.set("type", params.type);
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));

    return request<AdminNotificationItem[]>(`/api/notifications/admin/all?${query.toString()}`);
}

export async function deleteNotificationByAdmin(id: string): Promise<void> {
    return request<void>(`/api/notifications/admin/${id}`, {
        method: "DELETE",
    });
}

export async function bulkDeleteNotificationsByAdmin(ids: string[]): Promise<{ message: string }> {
    return request<{ message: string }>("/api/notifications/admin/bulk-delete", {
        method: "POST",
        body: JSON.stringify(ids),
    });
}

// ─── Admin Wardrobes API ──────────────────────────────────────────────────────

export interface AdminWardrobeItem {
    id: string;
    userInternalId: number;
    userDisplayName: string;
    userEmail: string;
    name: string | null;
    originalImageUrl: string;
    removedBgUrl: string | null;
    brand: string | null;
    notes: string | null;
    isActive: boolean;
    category: string;
    bgRemovalStatus: string;
    createdAt: string;
}

export interface PagedWardrobeResponse {
    items: AdminWardrobeItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface GetAdminWardrobeItemsParams {
    page?: number;
    pageSize?: number;
    userInternalId?: number;
    category?: string;
    search?: string;
}

export async function getAdminWardrobeItems(params: GetAdminWardrobeItemsParams = {}): Promise<PagedWardrobeResponse> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.userInternalId !== undefined) query.set("userInternalId", String(params.userInternalId));
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    return request<PagedWardrobeResponse>(`/api/admin/wardrobe?${query.toString()}`);
}

export async function toggleDeactivateWardrobeItem(id: string, isActive: boolean): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/wardrobe/${id}/deactivate`, {
        method: "PUT",
        body: JSON.stringify(isActive),
    });
}

export async function deleteWardrobeItemByAdmin(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/wardrobe/${id}`, {
        method: "DELETE",
    });
}

export async function bulkDeleteWardrobeItemsByAdmin(ids: string[]): Promise<{ message: string }> {
    return request<{ message: string }>("/api/admin/wardrobe/bulk-delete", {
        method: "POST",
        body: JSON.stringify(ids),
    });
}

// ─── Admin Outfits API ────────────────────────────────────────────────────────

export interface AdminOutfitItem {
    id: string;
    userInternalId: number;
    userDisplayName: string;
    userEmail: string;
    title: string | null;
    canvasSnapshotUrl: string | null;
    isPublic: boolean;
    likeCount: number;
    createdAt: string;
}

export interface PagedOutfitResponse {
    items: AdminOutfitItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface GetAdminOutfitsParams {
    page?: number;
    pageSize?: number;
    userInternalId?: number;
    isPublic?: boolean;
    search?: string;
}

export async function getAdminOutfits(params: GetAdminOutfitsParams = {}): Promise<PagedOutfitResponse> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.userInternalId !== undefined) query.set("userInternalId", String(params.userInternalId));
    if (params.isPublic !== undefined) query.set("isPublic", String(params.isPublic));
    if (params.search) query.set("search", params.search);

    return request<PagedOutfitResponse>(`/api/admin/outfits?${query.toString()}`);
}

export async function deleteOutfitByAdmin(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/outfits/${id}`, {
        method: "DELETE",
    });
}

export async function bulkDeleteOutfitsByAdmin(ids: string[]): Promise<{ message: string }> {
    return request<{ message: string }>("/api/admin/outfits/bulk-delete", {
        method: "POST",
        body: JSON.stringify(ids),
    });
}

// ─── Admin Payments API ───────────────────────────────────────────────────────

export interface AdminPaymentTransaction {
    id: string;
    userInternalId: number;
    userDisplayName: string;
    userEmail: string;
    subscriptionPlanName: string;
    amount: number;
    currency: string;
    paymentGateway: string;
    status: string;
    gatewayTransactionId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PagedPaymentTransactionResponse {
    items: AdminPaymentTransaction[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface GetAdminPaymentTransactionsParams {
    page?: number;
    pageSize?: number;
    gateway?: string;
    status?: string;
    userInternalId?: number;
}

export async function getAdminPaymentTransactions(params: GetAdminPaymentTransactionsParams = {}): Promise<PagedPaymentTransactionResponse> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
    if (params.gateway) query.set("gateway", params.gateway);
    if (params.status) query.set("status", params.status);
    if (params.userInternalId !== undefined) query.set("userInternalId", String(params.userInternalId));

    return request<PagedPaymentTransactionResponse>(`/api/admin/payments/transactions?${query.toString()}`);
}




