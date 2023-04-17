import type {User, UserData, DataDiff} from '../data/Data';
import type {Func} from '../util/Utils';

export async function getData(): Promise<UserData> {
  throw Error("AAAAA");
}

export function subscribeToUserChanges(onUserUpdate: (user: User | null) => void): Func {
  onUserUpdate(null);
  return () => {};
}

export function loginPopup() {

}

export function logout() {

}

export async function saveAll(data: DataDiff) {

}