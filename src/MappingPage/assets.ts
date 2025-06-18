
const assets = {
  note_flick: "/assets/mapping/note_flick.png",
  note_long: "/assets/mapping/note_long.png",
  note_normal: "/assets/mapping/note_normal.png",
  note_slide_among: "/assets/mapping/note_slide_among.png",
  timing_tack: "/assets/mapping/timing_tack.wav",
  timing_tick: "/assets/mapping/timing_tick.wav",
  perfect: "/assets/mapping/perfect.mp3",
  flick: "/assets/mapping/flick.mp3",
  long: "/assets/mapping/long.mp3",
  d4dj_tap: "/assets/mapping/d4dj_tap.png",
  d4dj_stop: "/assets/mapping/d4dj_stop.png",
  d4dj_slide: "/assets/mapping/d4dj_slide.png",
  d4dj_slide_flick: "/assets/mapping/d4dj_slide_flick.png",
  d4dj_hold: "/assets/mapping/d4dj_hold.png",
  d4dj_flick: "/assets/mapping/d4dj_flick.png",
  maodie_tap: "/assets/mapping/maodie.png",
}

for (const k in assets) {
  assets[(k as keyof typeof assets)] = process.env.PUBLIC_URL + assets[(k as keyof typeof assets)]
}

export default assets

