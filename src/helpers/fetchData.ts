const API_NODE = "http://localhost:8083/";

type MethodProps = "GET" | "POST" | "PUT" | "DELETE";

export const fetchApiNodeNoticies = async (
  method: MethodProps,
  endPoint: string,
  params?: FormData | Record<number, any>
) => {
  try {
    let url = `${API_NODE}${endPoint}`;
    let requestOptions: RequestInit = {
      method: method,
      mode: "cors",
      cache: "no-cache",
    };

    if ((method === "POST" || method === "PUT") && params) {
      if (params instanceof FormData) {
        requestOptions.body = params;
      } else {
        requestOptions.headers = { "Content-Type": "application/json" };
        requestOptions.body = JSON.stringify(params);
      }
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
