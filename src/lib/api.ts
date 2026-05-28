const BASE_URL = "http://171.237.179.15:5070";

export function getToken(): string | null {
    return localStorage.getItem("accessToken");
}

export function setToken(token: string) {
    localStorage.setItem("accessToken", token);
}

export function clearToken() {
    localStorage.removeItem("accessToken");
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const hdrs = new Headers(options.headers as HeadersInit);
    if (!hdrs.has("Content-Type")) hdrs.set("Content-Type", "application/json");
    if (!hdrs.has("Accept")) hdrs.set("Accept", "application/json");
    if (token && !hdrs.has("Authorization")) hdrs.set("Authorization", `Bearer ${token}`);

    console.debug("[API] Request", { url: `${BASE_URL}${path}`, method: options.method ?? "GET", hasToken: !!token });
    // Log headers we will send (helpful to confirm Authorization present)
    try {
        console.debug("[API] Request headers", { Authorization: hdrs.get("Authorization"), "Content-Type": hdrs.get("Content-Type") });
    } catch (e) {
        // ignore logging failures
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: hdrs,
    });

    if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
            const txt = await res.text();
            if (txt) {
                try {
                    const data = JSON.parse(txt);
                    errMsg = data?.message || data?.title || data?.error || errMsg;
                } catch {
                    errMsg = txt;
                }
            }
        } catch {
            // ignore
        }
        throw new Error(errMsg);
    }

    // Some endpoints return 204 No Content
    if (res.status === 204) return undefined as unknown as T;

    return res.json() as Promise<T>;
}

// ─── AdminUsers API ────────────────────────────────────────────────────────────

export interface AdminUser {
    userId: string;
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
