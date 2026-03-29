// 🔥 ตัวกลางเรียก API ทั้งระบบ
export async function fetchWithAuth(url: string | URL | Request, options: RequestInit = {}) {
  let accessToken = localStorage.getItem("accessToken");

  // ยิง request ปกติ
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: "Bearer " + accessToken
    }
  });

  // 🔥 ถ้า token หมดอายุ
  if (res.status === 401) {
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include"
    });

    if (!refreshRes.ok) {
      // ❌ refresh ไม่ได้ → logout
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return;
    }

    const data = await refreshRes.json();

    // ✅ เก็บ token ใหม่
    localStorage.setItem("accessToken", data.accessToken);

    // 🔁 ยิง request ใหม่
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Bearer " + data.accessToken
      }
    });
  }

  return res;
}