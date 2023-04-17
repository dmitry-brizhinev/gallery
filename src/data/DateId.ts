import {assert, type Day, pad2} from "../util/Utils";
import {castToTypedef, type StrongTypedef} from "../util/StrongTypedef";

type RawDateId = `C${string}`;
declare const dateid: unique symbol;
export type DateId = StrongTypedef<RawDateId, typeof dateid>;

const DateIdRegex = /^C(20\d\d)-([01]\d)-([0123]\d)$/;

export function checkDateId(id: string): DateId | null {
  if (!DateIdRegex.test(id)) return null;

  const did = castToTypedef<typeof dateid, RawDateId>(`C${id.slice(1)}`);

  const {month, day} = idToDay(did);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return did;
}

export function dateToId(date: Date): DateId {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const id = checkDateId(`C${year}-${month}-${day}`);
  assert(id, `Failed constructing DateId with date ${date}`);
  return id;
}

export function incrementId(id: DateId, incrementDays: number): DateId {
  const date = idToDate(id);
  date.setDate(date.getDate() + incrementDays);
  return dateToId(date);
}

export function idToDay(id: DateId): Day {
  const year = Number.parseInt(id.substring(1, 5));
  const month = Number.parseInt(id.substring(6, 8));
  const day = Number.parseInt(id.substring(9, 11));
  return {year, month, day};
}

export function idToDate(id: DateId): Date {
  const {year, month, day} = idToDay(id);
  return new Date(year, month - 1, day);
}

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {weekday: 'long'});
const monthFormatter = new Intl.DateTimeFormat('en-US', {month: 'short'});

export function idToNiceString(id: DateId): string {
  const idDate = idToDate(id);
  const toDate = new Date(); toDate.setHours(0, 0, 0, 0);


  const dayDiff = Math.round((toDate.getTime() - idDate.getTime()) / (1000 * 60 * 60 * 24));

  let weekday = weekdayFormatter.format(idDate);

  if (dayDiff === 0) weekday = 'Today';
  else if (dayDiff === 1) weekday = 'Yesterday';
  else if (dayDiff === -1) weekday = 'Tomorrow';
  else if (dayDiff >= -7 && dayDiff <= 7) {
    weekday = dayDiff < 0 ? `Next ${weekday}` : `Last ${weekday}`;
  }

  const month = monthFormatter.format(idDate);
  const day = pad2(idDate.getDate());

  if (idDate.getFullYear() === toDate.getFullYear()) {
    return `${weekday}, ${month} ${day}`;
  } else {
    const year = idDate.getFullYear();
    return `${weekday}, ${year}-${month}-${day}`;
  }
}
