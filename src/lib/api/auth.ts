// src/lib/api/auth.ts

// ✅ 统一接口路径
export const AuthAPI = {
  login: "/api/auth/login",                         // 邮箱密码登录
  register: "/api/auth/register",                   // 注册
  logout: "/api/auth/logout",                       // 登出
  me: "/api/auth/me",                               // 获取当前用户信息

  // 第三方登录
  loginWithGoogle: "/api/auth/google",              // Google 登录
  loginWithPhone: "/api/auth/phone",                // 手机验证码登录
  sendSMSCode: "/api/auth/send-code",               // 请求发送验证码（登录/注册）

  // 找回密码
  requestPasswordReset: "/api/auth/request-password-reset", // 请求验证码
  resetPassword: "/api/auth/reset-password",               // 输入验证码 + 新密码重设

  // 找回账号（预留）
  recoverAccount: "/api/auth/recover-account",             // 输入手机号/身份证等找回账号
};

// ✅ 登录请求格式
export interface LoginRequest {
  email: string;
  password: string;
  region?: "CN" | "INTL"; // 可选：国内/国际
}

// ✅ 注册请求格式
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TEACHER";
  region?: "CN" | "INTL";
}

// ✅ 通用登录响应
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER";
    avatarUrl?: string;
    points?: number;
  };
}

// ✅ Google 登录
export interface GoogleLoginRequest {
  idToken: string;
  region?: "CN" | "INTL";
}

// ✅ 手机验证码登录
export interface PhoneLoginRequest {
  phone: string;
  code: string;
  region?: "CN" | "INTL";
}

// ✅ 发送短信验证码
export interface SendSMSCodeRequest {
  phone: string;
  scene: "login" | "register"; // 使用场景
  region?: "CN" | "INTL";
}

// ✅ 请求重设密码（发送验证码）
export interface RequestPasswordReset {
  email: string;
  region?: "CN" | "INTL";
}

// ✅ 重置密码请求
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  region?: "CN" | "INTL";
}

// ✅ 找回账号（可选项，暂不启用）
export interface RecoverAccountRequest {
  phone?: string;
  idCardLast6?: string;
  region?: "CN" | "INTL";
}

// ✅ 通用错误响应
export interface ErrorResponse {
  error: string;
  code?: string;
}
