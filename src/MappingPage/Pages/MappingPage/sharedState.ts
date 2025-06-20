import { observable, computed, reaction } from "mobx"
import { Music } from "../../states"
import { scope } from "../../../MappingScope/scope"
import { assert } from "../../../Common/utils"
import { NoteType } from "../../../MappingScope/EditMap"

export type ToolTypes = "none" | "single" | "slide" | "delete" | "laser"

const NoteSig = (n: NoteType) => `${n.timepoint}:${n.offset}:${n.lane}`
const NoteSigWithoutLane = (n: NoteType) => `${n.timepoint}:${n.offset}`
const AK47_FIRE_DELAY = 0.1;

class State {

  @observable private _viewposition = 0

  // some offset that let the progress line can be a little higher than view port bottom
  @computed get viewOffset() { return 100 / this.timeHeightFactor }

  @computed get viewduration() {
    return Music.duration - this.viewOffset
  }
  getViewposition = () => {
    if (this.tracking) return Music.position() - this.viewOffset
    return this._viewposition
  }
  setViewposition = (v: number) => {
    const offset = this.viewOffset
    if (v < -offset) v = -offset
    if (v > Music.duration - offset) v = Music.duration - 0.05 - offset
    if (this.tracking) Music.seek(v + offset)
    else this._viewposition = v
  }
  @observable tracking = false
  @observable timeHeightFactor = 400
  @observable division = 4
  @observable tool = "none" as ToolTypes

  // we mirror 1. notes layer (and bar layer) 2. action preview layer 3. input event handler
  @observable mirror = false

  @computed get paddedDuration() {
    return Music.duration * 1.2
  }

  @computed get samePosNotes() {
    const notes = new Set<number>()
    for (const slide of scope.map.slidelist) {
      let from = assert(scope.map.notes.get(slide.notes[0]))
      for (let i = 1; i < slide.notes.length; i++) {
        const to = assert(scope.map.notes.get(slide.notes[i]))
        if (from.timepoint === to.timepoint && from.offset === to.offset) {
          notes.add(from.id)
          notes.add(to.id)
        }
        from = to
      }
    }
    const set = new Set<string>()
    for (const n of scope.map.notelist) {
      const sig = NoteSig(n)
      if (set.has(sig)) notes.add(n.id)
      set.add(sig)
    }
    return notes
  }

  @computed get tooCloseNotes() {
    return new Set<number>(
      Array.from(scope.map.timepoints.keys())
        .sort((a, b) => scope.map.timepoints.get(a)!.time - scope.map.timepoints.get(b)!.time)
        .flatMap((tpid) => {
          const tp = assert(scope.map.timepoints.get(tpid));
          const tpOffset = 60 / (tp.bpm * 48);

          return scope.map.notelist
            .filter(v => v.timepoint == tpid)
            .sort((a, b) => a.offset - b.offset)
            .map(v => {
              return { id: v.id, time: tp.time + tpOffset * v.offset }
            })
        })
        .filter((v, i, a) => (i < (a.length - 1)) ? (a[i + 1].time - v.time < AK47_FIRE_DELAY) : false)
        .map(v => v.id)
    );
  }

  @computed get sameTimeNotes() {
    const notes = new Set<number>()
    const set = new Set<string>()
    for (const n of scope.map.notelist) {
      const sig = NoteSigWithoutLane(n)
      if (set.has(sig)) notes.add(n.id)
      set.add(sig)
    }
    return notes
  }

  @computed get noteListOrdered() {
    return scope.map.notelist.slice().sort((a, b) => a.realtimecache - b.realtimecache)
  }

  constructor() {
    reaction(() => this.tracking, t => {
      const offset = 100 / this.timeHeightFactor
      if (!t) this._viewposition = Music.position() - offset
    })
  }
}

export const MappingState = new State()

export function GridD1() {
  const tps = scope.map.timepointlist
  const list: Array<{ time: number; name: string }> = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = (i < tps.length - 1 ? tps[i + 1].time : Music.duration) - 0.01
    let beat = 1
    while (true) {
      const time = tp.time + tp.ticktimecache * 48 * beat
      if (time >= endtime) break
      const bar = ((beat / tp.bpb) | 0) + 1
      const innerbeat = (beat % tp.bpb) + 1
      list.push({
        time,
        name: `${i + 1}:${bar}:${innerbeat}`
      })
      beat++
    }
  }
  return list
}


export function GridD2() {
  const tps = scope.map.timepointlist
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = (i < tps.length - 1 ? tps[i + 1].time : Music.duration) - 0.01
    let beat = 0
    const offset = tp.ticktimecache * 24
    while (true) {
      const time = tp.time + tp.ticktimecache * 48 * beat + offset
      if (time >= endtime) break
      list.push(time)
      beat++
    }
  }
  return list
}

export function GridD3() {
  const tps = scope.map.timepointlist
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = (i < tps.length - 1 ? tps[i + 1].time : Music.duration) - 0.01
    let beat_3 = 1
    while (true) {
      const time = tp.time + tp.ticktimecache * 16 * beat_3
      if (time >= endtime) break
      list.push(time)
      beat_3++
      if (beat_3 % 3 === 0) beat_3++
    }
  }
  return list
}

export function GridD4() {
  const tps = scope.map.timepointlist
  const list: number[] = []
  let endtime = 0
  for (let i = 0; i < tps.length; i++) {
    const tp = tps[i]
    endtime = (i < tps.length - 1 ? tps[i + 1].time : Music.duration) - 0.01
    let beat_2 = 0.5
    while (true) {
      const time = tp.time + tp.ticktimecache * 24 * beat_2
      if (time >= endtime) break
      list.push(time)
      beat_2++
    }
  }
  return list
}
