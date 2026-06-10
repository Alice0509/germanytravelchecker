import { buildTripDatesResult, getTripDatesDisclaimer } from "./tripDatesResult.js";

function getOverallRiskLevel(segmentResults = []) {
  if (segmentResults.some((segment) => segment.riskLevel === "high")) {
    return "high";
  }

  if (segmentResults.some((segment) => segment.riskLevel === "medium")) {
    return "medium";
  }

  return "low";
}

function getOverallTitle(riskLevel) {
  if (riskLevel === "high") {
    return "Your Germany itinerary needs extra planning.";
  }

  if (riskLevel === "medium") {
    return "Your itinerary includes dates to plan around.";
  }

  return "Your Germany itinerary looks fairly normal.";
}

function getOverallSummary({ riskLevel, segmentResults = [], transferDays = [] } = {}) {
  const cityNames = segmentResults.map((segment) => segment.city.name).join(" → ");
  const cityText = cityNames || "your cities";
  const transferText =
    transferDays.length > 0
      ? ` It also includes ${transferDays.length} transfer day${transferDays.length === 1 ? "" : "s"} where both cities may affect your timing, food or transport backup.`
      : "";

  if (riskLevel === "high") {
    return `Your itinerary across ${cityText} includes at least one segment with a public holiday or strong closure-risk date. Regular shops and supermarkets are usually closed on public holidays, and travel demand may be higher around long weekends.${transferText}`;
  }

  if (riskLevel === "medium") {
    return `Your itinerary across ${cityText} includes dates to plan around, such as Sundays, school holiday overlaps or transfer days. Before you lock the plan, check closure patterns, food and water options, transport updates and buffer time.${transferText}`;
  }

  return `Your itinerary across ${cityText} looks fairly normal based on public holidays, Sundays and school holiday data. Exact opening hours and transport details should still be checked before relying on specific places.${transferText}`;
}

function getTotalDateSpan(segmentResults = []) {
  const sorted = segmentResults
    .flatMap((segment) => [segment.startDateKey, segment.endDateKey])
    .filter(Boolean)
    .sort();

  if (sorted.length === 0) {
    return null;
  }

  return {
    startDateKey: sorted[0],
    endDateKey: sorted[sorted.length - 1],
  };
}

function findTransferDays(segmentResults = []) {
  const transferDays = [];

  for (let index = 0; index < segmentResults.length - 1; index += 1) {
    const currentSegment = segmentResults[index];
    const nextSegment = segmentResults[index + 1];

    if (
      currentSegment?.endDateKey &&
      nextSegment?.startDateKey &&
      currentSegment.endDateKey === nextSegment.startDateKey
    ) {
      transferDays.push({
        date: currentSegment.endDateKey,
        fromCity: currentSegment.city.name,
        toCity: nextSegment.city.name,
        note:
          "Before this transfer, check station services, food and water options, transport updates and accommodation timing in both cities.",
      });
    }
  }

  return transferDays;
}

export function buildMultiCityTripResult({ segments = [] } = {}) {
  const segmentResults = segments
    .map((segment, index) => {
      const result = buildTripDatesResult({
        cityId: segment.cityId,
        startDate: segment.startDate,
        endDate: segment.endDate,
        publicHolidays: segment.publicHolidays || [],
        schoolHolidays: segment.schoolHolidays || [],
      });

      if (!result) {
        return null;
      }

      return {
        ...result,
        segmentId: segment.id || `segment-${index + 1}`,
        segmentIndex: index,
      };
    })
    .filter(Boolean);

  if (segmentResults.length === 0) {
    return null;
  }

  const riskLevel = getOverallRiskLevel(segmentResults);
  const transferDays = findTransferDays(segmentResults);
  const dateSpan = getTotalDateSpan(segmentResults);

  return {
    riskLevel,
    title: getOverallTitle(riskLevel),
    summary: getOverallSummary({
      riskLevel,
      segmentResults,
      transferDays,
    }),
    segmentCount: segmentResults.length,
    dateSpan,
    segmentResults,
    transferDays,
    disclaimer: getTripDatesDisclaimer(),
  };
}

export function buildDefaultMultiCityTripResult({
  segments = [
    {
      id: "segment-1",
      cityId: "munich",
      startDate: "2026-06-05",
      endDate: "2026-06-08",
    },
    {
      id: "segment-2",
      cityId: "berlin",
      startDate: "2026-06-08",
      endDate: "2026-06-12",
    },
  ],
} = {}) {
  return buildMultiCityTripResult({ segments });
}
