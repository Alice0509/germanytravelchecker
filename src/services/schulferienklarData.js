export const SCHULFERIENKLAR_DATA_BASE_URL =
  "https://www.schulferienklar.de/data";

async function fetchJson(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

export function getSchulferienklarDataUrl(path) {
  return `${SCHULFERIENKLAR_DATA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export async function loadSchoolHolidayIndex() {
  return fetchJson(
    getSchulferienklarDataUrl("holidays/index.json"),
    "Could not load Schulferienklar school holiday index.",
  );
}

export async function loadPublicHolidayIndex() {
  return fetchJson(
    getSchulferienklarDataUrl("public-holidays/index.json"),
    "Could not load Schulferienklar public holiday index.",
  );
}

export async function loadSchoolHolidayDataset(jsonFile) {
  if (!jsonFile) {
    return { holidays: [] };
  }

  return fetchJson(
    getSchulferienklarDataUrl(`holidays/${jsonFile}`),
    "Could not load Schulferienklar school holiday dataset.",
  );
}

export async function loadPublicHolidayDataset(jsonFile) {
  if (!jsonFile) {
    return { holidays: [] };
  }

  return fetchJson(
    getSchulferienklarDataUrl(`public-holidays/${jsonFile}`),
    "Could not load Schulferienklar public holiday dataset.",
  );
}

export function findSchoolHolidayDataset(index, bundeslandCode) {
  return (
    index?.datasets?.find(
      (dataset) => dataset.bundeslandCode === bundeslandCode,
    ) || null
  );
}

export function findPublicHolidayDataset(index, bundeslandCode, year) {
  return (
    index?.datasets?.find(
      (dataset) =>
        dataset.bundeslandCode === bundeslandCode &&
        Number(dataset.year) === Number(year),
    ) || null
  );
}
