# Easter eggs — owner reference

These triggers are intentionally not listed on the live site. Original CSS/SVG artwork only; no official One Piece art, audio, or dialogue is used.

| Egg                    | Trigger                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Wanted Poster          | Konami sequence, type `luffy` or `one piece`, or tap the footer mark five times. Download and share actions are provided. |
| Log Pose               | Compass at the lower left on desktop; points to the next section and scrolls on click.                                    |
| Den Den Mushi          | Contact section. Enable sound to hear the ringing Den Den Mushi tone and pick up the call to hear the pickup sound and reveal the email, followed by a surprise Rickroll transmission. |
| Devil Fruit skills     | Hover, focus, or tap one of the strong skill chips.                                                                       |
| Conqueror’s Haki       | Hold Space for one second near the hero on desktop, or long-press the hero title on touch.                                |
| Observation Haki       | Press `H` or choose it in Cmd/Ctrl+K; press `H` or Esc to turn it off.                                                    |
| Gomu Gomu cursor       | Type `gomu` to toggle the rubber cursor.                                                                                  |
| Gear 5 / Joy mode      | Choose Gear 5 in Cmd/Ctrl+K; it ends after 15 seconds or when toggled again.                                              |
| Poneglyph hunt         | Collect the three faint glyphs near the hero cue, project grid, and footer/contact area. Progress appears in Cmd/Ctrl+K.  |
| Ship wheel loader      | Short page-load intro.                                                                                                    |
| Lost in the Grand Line | Visit any unknown route (custom 404).                                                                                     |
| Devtools console       | Open the browser console.                                                                                                 |
| DarkGlance Jolly Roger | Hover the footer flag; click it to open the Wanted Poster.                                                                |

Pirate mode is toggled in Cmd/Ctrl+K and persists locally. When disabled, egg interactions and hints are disabled. Egg state is stored safely in localStorage where applicable. All effects honor reduced-motion preferences; sound is off by default.

## Follow-up items

- Replace the poster initials with an original owner illustration if desired.
- Den Den Mushi ringing and pickup audios are served from the high-speed CDN and pre-cached in memory and HTTP cache.
- The hero ship-wheel intro is non-blocking and must remain under 1.5 seconds.
