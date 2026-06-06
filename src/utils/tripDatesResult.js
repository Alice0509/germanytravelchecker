import { findTravelCityById } from "../data/travelCities.js";
import {
  addDays,
  formatDateKey,
  isSunday,
  parseDateKey,
  startOfLocalDay,
} from "./checkToday.js";

function getHolidayName(holiday) {
  return holiday?.name?.en || holiday?.name?.de || holiday?.name || "Holiday";
}

function normalizeDateInput(value) {
  if (value instanceof Date) {
    return startOfLocalDay(value);
  }

  if (typeof value === "string") {
    return parseDateKey(value);
  }

  return null;
}

function getInclusiveDayCount(startDate, endDate) {
  const difference = endDate.getTime() - startDate.getTime();
  return Math.floor(difference / 86400000) + 1;
}

function getDateKeysInRange(startDate, endDate) {
  const dateKeys = [];
  let current = startDate;

  while (current && current <= endDate) {
    dateKeys.push(formatDateKey(current));
    current = addDays(current, 1);
  }

  return dateKeys;
}

function isPublicHolidayInRange(holiday, startDateKey, endDateKey) {
  if (!holiday?.date || holiday.includeInDefaultCalendar === false) {
    return false;
  }

  return startDateKey <= holiday.date && holiday.date <= endDateKey;
}

function doesSchoolHolidayOverlap(holiday, startDateKey, endDateKey) {
  if (!holiday?.startDate || !holiday?.endDate) {
    return false;
  }

  return holiday.startDate <= endDateKey && holiday.endDate >= startDateKey;
}

function getTripDatesRiskLevel({
  publicHolidays = [],
  sundays = [],
  schoolHolidayOverlaps = [],
} = {}) {
  if (publicHolidays.length > 0) {
    return "high";
  }

  if (sundays.length > 0 && schoolHolidayOverlaps.length > 0) {
    return "medium";
  }

  if (sundays.length > 0 || schoolHolidayOverlaps.length > 0) {
    return "medium";
  }

  return "low";
}

function getTripDatesTitle({ cityName, riskLevel } = {}) {
  const place = cityName || "Germany";

  if (riskLevel === "high") {
    return `Your ${place} dates need extra planning.`;
  }

  if (riskLevel === "medium") {
    return `Your ${place} dates have some travel notes.`;
  }

  return `Your ${place} dates look fairly normal.`;
}

function getTripDatesSummary({
  cityName,
  stateName,
  riskLevel,
  publicHolidays = [],
  sundays = [],
  schoolHolidayOverlaps = [],
} = {}) {
  const place = cityName || "your city";
  const state = stateName || "this federal state";

  if (publicHolidays.length > 0) {
    const holidayNames = publicHolidays.map(getHolidayName).join(", ");

    return `Your trip includes ${holidayNames} in ${state}. Regular shops and supermarkets are usually closed on public holidays in Germany, and travel demand may be higher around these dates.`;
  }

  if (sundays.length > 0 && schoolHolidayOverlaps.length > 0) {
    return `Your trip to ${place} includes at least one Sunday and overlaps a school holiday period in ${state}. Shops may be closed on Sundays, and trains, hotels, roads or attractions may be busier.`;
  }

  if (sundays.length > 0) {
    return `Your trip to ${place} includes at least one Sunday. In Germany, many regular shops and supermarkets are usually closed on Sundays.`;
  }

  if (schoolHolidayOverlaps.length > 0) {
    return `Your trip overlaps a school holiday period in ${state}. Shops are not usually closed because of school holidays, but trains, hotels, roads and attractions may be busier.`;
  }

  if (riskLevel === "low") {
    return `Your dates look fairly normal for ${place}. Regular shops, supermarkets, cafés and services are generally more likely to follow normal opening patterns, but exact hours still vary by business.`;
  }

  return `Your dates have some travel notes for ${place}. Check local opening hours and transport plans before relying on a specific place.`;
}

function getTripDatesWarnings({
  publicHolidays = [],
  sundays = [],
  schoolHolidayOverlaps = [],
} = {}) {
  const warnings = [];

  if (publicHolidays.length > 0) {
    warnings.push({
      type: "public-holiday",
      title: "Public holiday in your date range",
      note:
        "Regular shops and supermarkets are usually closed on public holidays. Attractions, restaurants, stations and airports may follow different opening patterns.",
      items: publicHolidays.map((holiday) => ({
        date: holiday.date,
        name: getHolidayName(holiday),
      })),
    });
  }

  if (sundays.length > 0) {
    warnings.push({
      type: "sunday",
      title: "Sunday closure pattern",
      note:
        "Many regular shops and supermarkets are usually closed on Sundays in Germany. Train stations, airports, gas stations, cafés, bakeries, restaurants and hotels may be useful fallback options.",
      items: sundays.map((dateKey) => ({
        date: dateKey,
        name: "Sunday",
      })),
    });
  }

  if (schoolHolidayOverlaps.length > 0) {
    warnings.push({
      type: "school-holiday",
      title: "School holiday overlap",
      note:
        "School holidays do not usually close shops, but trains, hotels, roads and attractions may be busier during these periods.",
      items: schoolHolidayOverlaps.map((holiday) => ({
        startDate: holiday.startDate,
        endDate: holiday.endDate,
        name: getHolidayName(holiday),
      })),
    });
  }

  return warnings;
}

export function getTripDatesDisclaimer() {
  return "Germany Travel Checker gives rule-based travel guidance. Exact opening hours, prices, transport disruptions and local availability can change, so always verify important plans with official sources, Google Maps or the business website.";
}

export function buildTripDatesResult({
  cityId,
  startDate,
  endDate,
  publicHolidays = [],
  schoolHolidays = [],
} = {}) {
  const city = findTravelCityById(cityId);
  const normalizedStartDate = normalizeDateInput(startDate);
  const normalizedEndDate = normalizeDateInput(endDate);

  if (!city || !normalizedStartDate || !normalizedEndDate) {
    return null;
  }

  const rangeStart =
    normalizedStartDate <= normalizedEndDate ? normalizedStartDate : normalizedEndDate;
  const rangeEnd =
    normalizedStartDate <= normalizedEndDate ? normalizedEndDate : normalizedStartDate;

  const startDateKey = formatDateKey(rangeStart);
  const endDateKey = formatDateKey(rangeEnd);
  const dateKeys = getDateKeysInRange(rangeStart, rangeEnd);
  const sundays = dateKeys.filter((dateKey) => isSunday(parseDateKey(dateKey)));

  const publicHolidayOverlaps = publicHolidays.filter((holiday) =>
    isPublicHolidayInRange(holiday, startDateKey, endDateKey),
  );

  const schoolHolidayOverlaps = schoolHolidays.filter((holiday) =>
    doesSchoolHolidayOverlap(holiday, startDateKey, endDateKey),
  );

  const riskLevel = getTripDatesRiskLevel({
    publicHolidays: publicHolidayOverlaps,
    sundays,
    schoolHolidayOverlaps,
  });

  const stateName = city.englishStateName || city.bundeslandName;
  const title = getTripDatesTitle({
    cityName: city.name,
    riskLevel,
  });
  const summary = getTripDatesSummary({
    cityName: city.name,
    stateName,
    riskLevel,
    publicHolidays: publicHolidayOverlaps,
    sundays,
    schoolHolidayOverlaps,
  });

  return {
    city,
    startDate: rangeStart,
    endDate: rangeEnd,
    startDateKey,
    endDateKey,
    dayCount: getInclusiveDayCount(rangeStart, rangeEnd),
    dateKeys,
    riskLevel,
    title,
    summary,
    publicHolidays: publicHolidayOverlaps,
    sundays,
    schoolHolidayOverlaps,
    warnings: getTripDatesWarnings({
      publicHolidays: publicHolidayOverlaps,
      sundays,
      schoolHolidayOverlaps,
    }),
    disclaimer: getTripDatesDisclaimer(),
  };
}

export function buildDefaultTripDatesResult({
  cityId = "berlin",
  startDate = new Date(),
  endDate = addDays(new Date(), 3),
  publicHolidays = [],
  schoolHolidays = [],
} = {}) {
  return buildTripDatesResult({
    cityId,
    startDate,
    endDate,
    publicHolidays,
    schoolHolidays,
  });
}
