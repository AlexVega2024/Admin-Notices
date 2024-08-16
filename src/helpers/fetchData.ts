const API_NODE = "http://localhost:8083/";

type MethodProps = "GET" | "POST" | "PUT" | "DELETE";

export const fetchApiNodeNoticies = async (
  method: MethodProps,
  endPoint: string,
  params?: Record<number, string> 
) => {
  try {
    let url = `${API_NODE}${endPoint}`;
    let requestOptions: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      cache: "no-cache",
    };

    if (method === "GET" && params) {
      const queryParams = new URLSearchParams(params);
      url += `?${queryParams.toString()}`;
    } else if ((method === "POST" || method === "PUT") && params) {
      requestOptions.body = JSON.stringify(params);
    }

    const response = await fetch(url, requestOptions);

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      throw new Error(
        `Error en la solicitud: ${response.status} ${response.statusText}`
      );
    }

    // Convertir la respuesta a JSON y retornarla
    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
