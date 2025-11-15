import { Admin, AuthUser } from "@/lib/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const login = async (email: string, password: string) => {
  try {
    console.log("API Login request:", { email, API_URL });
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Login API Response:", { 
      status: response.status, 
      ok: response.ok, 
      data 
    });
    if (response.ok) {
      return {
        success: true,
        data: data as AuthUser,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.error(error);
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data as Admin,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (token: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/profile`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllAdmins = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/settings/admins`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ĐÚNG CHƯA: This code matches the API documentation as shown in the image.
// The API expects POST to /api/admin/settings/admins with JSON body: { "name", "email", "password" }.

export const createAdminAccount = async (
  token: string,
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/settings/admins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          "name": name,
          "email": email,
          "password": password,
        }
      ),
    });
    // console.log("body", JSON.stringify(
    //     {
    //       "name": name,
    //       "email": email,
    //       "password": password,
    //     }
    //   ));
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const deleteAdminAccount = async (
  token: string,
  id: string,
  adminPassword: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/settings/admins/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const changeAdminPassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; data?: unknown; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/settings/password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",

      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          data.detail ||
          "An unknown error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
