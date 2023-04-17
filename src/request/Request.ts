import {type User, type UserData, type DataDiff, makeUserData} from '../data/Data';
import {delay, type Func} from '../util/Utils';
import {Map as IMap} from 'immutable';

export async function getData(): Promise<UserData> {
  const response = await fetch('/listdir');
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} ${response.url}`);
  }
  return makeUserData({pages: IMap(await response.json())});
}

export function subscribeToUserChanges(onUserUpdate: (user: User | null) => void): Func {
  onUserUpdate({name: "UsEr.NaMe", uid: "username"});
  return () => {};
}

export function loginPopup() {

}

export function logout() {

}

export async function saveAll(data: DataDiff) {
  await delay(1000);
}