"""Synthesises Otium's reminder sounds as WAV files (plain Python, no extra libraries).

The sounds are original and covered by the project's MIT license.
Run from the project root:  python3 scripts/make-sounds.py
"""
import math
import os
import struct
import wave

RATE = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "resources", "sounds")


def silence(seconds):
    return [0.0] * int(seconds * RATE)


def add(buf, start, samples):
    """Mixes samples into buf starting at `start` seconds."""
    i0 = int(start * RATE)
    for i, s in enumerate(samples):
        if i0 + i < len(buf):
            buf[i0 + i] += s


def tone(freq, seconds, partials, attack=0.006):
    """A struck tone. partials: [(ratio, amplitude, decay seconds), ...]."""
    out = []
    n = int(seconds * RATE)
    for i in range(n):
        t = i / RATE
        env = min(1.0, t / attack)
        s = 0.0
        for ratio, amp, tau in partials:
            s += amp * math.exp(-t / tau) * math.sin(2 * math.pi * freq * ratio * t)
        out.append(env * s)
    return out


def drop(f_start, f_end, seconds=0.16, tau=0.05):
    """A water-drop 'bloop': a quick upward pitch glide that fades fast."""
    out = []
    phase = 0.0
    n = int(seconds * RATE)
    for i in range(n):
        t = i / RATE
        k = min(1.0, t / 0.05)
        f = f_start + (f_end - f_start) * (1 - (1 - k) ** 2)
        phase += 2 * math.pi * f / RATE
        env = min(1.0, t / 0.002) * math.exp(-t / tau)
        out.append(env * math.sin(phase))
    return out


def finish(buf, peak=0.45, fade=0.06):
    """Normalises to a gentle level and fades the tail to avoid clicks."""
    m = max(abs(s) for s in buf) or 1.0
    buf = [s / m * peak for s in buf]
    n = int(fade * RATE)
    for i in range(n):
        buf[-1 - i] *= i / n
    return buf


def write(name, buf):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name + ".wav")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32767)) for s in buf))
    print("wrote", os.path.relpath(path))


# Chime: two soft bell notes, a rising fifth (E5 -> B5).
bell = [(1, 1.0, 0.9), (2.0, 0.3, 0.5), (3.0, 0.1, 0.3), (4.2, 0.05, 0.2)]
chime = silence(2.2)
add(chime, 0.0, tone(659.25, 2.0, bell))
add(chime, 0.2, tone(987.77, 2.0, bell))
write("chime", finish(chime))

# Droplet: two water drops, the second a little higher and quieter.
droplet = silence(0.9)
add(droplet, 0.0, drop(650, 1500))
add(droplet, 0.0, [0.25 * s for s in tone(1500, 0.5, [(1, 1.0, 0.12)])])
add(droplet, 0.24, [0.7 * s for s in drop(850, 1900)])
add(droplet, 0.24, [0.15 * s for s in tone(1900, 0.5, [(1, 1.0, 0.1)])])
write("droplet", finish(droplet))

# Rise: an upward marimba-like arpeggio (C5, E5, G5), a gentle "get up".
mallet = [(1, 1.0, 0.45), (4.0, 0.22, 0.08), (10.0, 0.05, 0.03)]
rise = silence(1.6)
for i, f in enumerate((523.25, 659.25, 783.99)):
    add(rise, i * 0.14, tone(f, 1.2, mallet, attack=0.003))
write("rise", finish(rise))

# Bowl: a singing bowl with inharmonic partials and a slow, slightly beating tail.
bowl_partials = [(1, 1.0, 3.0), (1.002, 0.5, 3.0), (2.76, 0.45, 1.8), (5.40, 0.2, 1.0), (8.93, 0.08, 0.6)]
bowl = silence(3.6)
add(bowl, 0.0, tone(330, 3.5, bowl_partials, attack=0.01))
write("bowl", finish(bowl, peak=0.5))
