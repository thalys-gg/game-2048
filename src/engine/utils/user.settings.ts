import type { AppScreens } from '∆/types'
import { engine } from '∆/engine.singleton'
import { storage } from '∆/storage'

// Keys for saved items in storage
const KEY_VOLUME_MASTER = 'volume-master'
const KEY_VOLUME_BGM = 'volume-bgm'
const KEY_VOLUME_SFX = 'volume-sfx'

const KEY_LAST_SCREEN = 'last-screen'

/**
 * Persistent user settings of volumes.
 */
class UserSettings {
  public init() {
    engine().audio.setMasterVolume(this.getMasterVolume())
    engine().audio.bgm.setVolume(this.getBgmVolume())
    engine().audio.sfx.setVolume(this.getSfxVolume())
  }

  /** Get overall sound volume */
  public getMasterVolume() {
    return storage.getNumber(KEY_VOLUME_MASTER) ?? 0.5
  }

  /** Set overall sound volume */
  public setMasterVolume(value: number) {
    engine().audio.setMasterVolume(value)
    storage.setNumber(KEY_VOLUME_MASTER, value)
  }

  /** Get background music volume */
  public getBgmVolume() {
    return storage.getNumber(KEY_VOLUME_BGM) ?? 1
  }

  /** Set background music volume */
  public setBgmVolume(value: number) {
    engine().audio.bgm.setVolume(value)
    storage.setNumber(KEY_VOLUME_BGM, value)
  }

  /** Get sound effects volume */
  public getSfxVolume() {
    return storage.getNumber(KEY_VOLUME_SFX) ?? 1
  }

  /** Set sound effects volume */
  public setSfxVolume(value: number) {
    engine().audio.sfx.setVolume(value)
    storage.setNumber(KEY_VOLUME_SFX, value)
  }

  /** Get background music volume */
  public getLastScreen(): AppScreens {
    const value = storage.getString<AppScreens>(KEY_LAST_SCREEN) ?? 'Main'
    return value
  }

  /** Set background music volume */
  public setLastScreen(value: AppScreens) {
    storage.setString(KEY_LAST_SCREEN, value)
  }
}

/** Shared user settings instance */
export const userSettings = new UserSettings()
