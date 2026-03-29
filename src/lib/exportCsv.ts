export const exportToCsv = (data: any[], filename: string) => {
  if (data.length === 0) return;

  // Extraer cabeceras (keys)
  const headers = Object.keys(data[0]).join(",");

  // Mapear filas
  const rows = data.map((obj) =>
    Object.values(obj)
      .map((val) => `"${val}"`) // Envolver en comillas para evitar errores con comas
      .join(",")
  );

  // Crear contenido CSV
  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
