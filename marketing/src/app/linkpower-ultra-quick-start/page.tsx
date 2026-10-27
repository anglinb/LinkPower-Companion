import { LP3Guide, lp3Metadata, ULTRA_DEVICE, ULTRA_MANUAL, ULTRA_PRODUCT } from "../../components/LP3Guide";

export const metadata = lp3Metadata("LinkPower Ultra Quick Start: Setup, Charging & Specs", "Set up PeakDo LinkPower Ultra for Starlink Mini. Activation, charging and bypass, Bluetooth or Wi-Fi control, and specifications.", "/linkpower-ultra-quick-start/");
const topics = [
  { id: "overview", title: "What’s different" }, { id: "setup", title: "Setup & activation" },
  { id: "charging", title: "Charging & bypass" }, { id: "connect", title: "Connect your phone" },
  { id: "specs", title: "Specifications" }, { id: "faq", title: "Questions & help" },
];

export default function Page() {
  return <LP3Guide device={ULTRA_DEVICE} title="LinkPower Ultra quick start" description="From unboxing to your first battery reading. A practical guide for using the Ultra with Starlink Mini." topics={topics}>
    <section id="overview"><h2>What’s different about the Ultra</h2>
      <p>The Ultra is a slimmer LP3-generation battery: 99.9Wh of semi-solid cells, active cooling, and the same Bluetooth, Wi-Fi, and physical controls as LP3. It uses PeakDo’s LP3 web app and Wi-Fi monitoring service.</p>
      <p>PeakDo advertises 5.5+ hours for Starlink Mini at 20W; treat that as a manufacturer test result, not a guaranteed runtime. Conditions and load affect the result. <a href={ULTRA_PRODUCT}>Product details ↗</a></p>
    </section>
    <section id="setup"><h2>Setup &amp; activation</h2>
      <ol>
        <li>Remove the Mini’s kickstand and connect the supplied DC cable between the Ultra’s DC output and the Mini. Seat both plugs fully.</li>
        <li>Activate the Ultra before first use: connect a USB-C PD supply, or hold the power button for 10 seconds. Activation is complete when the screen turns on.</li>
        <li>Slide the battery onto the Mini until it clicks. Hold the button about two seconds and release at the flashing light to toggle DC output.</li>
      </ol>
      <aside><strong>Use the correct port.</strong> Never connect a charger to DC output. See the <a href={ULTRA_MANUAL}>Ultra quick start</a> for diagrams.</aside>
      <p>The box includes the Ultra, a DC cable, and a magnetic DC cable.</p>
    </section>
    <section id="charging"><h2>Charging &amp; bypass</h2>
      <p>Charge through USB-C, DC input, or magnetic DC input while the Mini stays powered. USB-C accepts 65W by default, with up to 100W enabled through software; USB-C output is limited to 65W. With the original Starlink Mini charger, DC input reaches about 60W; a 12V car charger reaches about 65W. The Ultra supports bypass charging.</p>
      <p>Charging or discharging at high power can shorten battery life, and the Ultra may get warm under heavy load. That is expected.</p>
    </section>
    <section id="connect"><h2>Connect your phone</h2>
      <p>Ultra support is coming in LinkPower for iOS 2.0.1, now in beta testing, and is still being verified with real hardware. The current App Store version cannot connect to the Ultra, and the Android app does not support it yet. Until 2.0.1 ships, use PeakDo’s web app.</p>
      <p>Pairing uses a six-digit code shown on the Ultra’s screen. In some browsers the battery may appear as “ESP32.” Wi-Fi account binding is a separate workflow: see the <a href="/linkpower-ultra-connection-guide/">Ultra Bluetooth &amp; Wi-Fi connection guide</a>.</p>
    </section>
    <section id="specs"><h2>Ultra specifications</h2>
      <table><caption>From <a href={ULTRA_PRODUCT}>PeakDo’s current product page</a></caption><tbody>
        <tr><th scope="row">Capacity</th><td>99.9Wh / 27,000mAh, semi-solid</td></tr>
        <tr><th scope="row">DC input</th><td>12–30V, 65W maximum</td></tr>
        <tr><th scope="row">DC output</th><td>15–21V, 65W maximum</td></tr>
        <tr><th scope="row">USB-C</th><td>65W in by default (100W via software), 65W out</td></tr>
        <tr><th scope="row">Size</th><td>243 × 115 × 22mm</td></tr>
        <tr><th scope="row">Weight</th><td>About 663g</td></tr>
        <tr><th scope="row">Display</th><td>1.05-inch LCD</td></tr>
        <tr><th scope="row">Mount</th><td>¼-inch tripod thread</td></tr>
        <tr><th scope="row">Protection rating</th><td>IP65</td></tr>
      </tbody></table>
      <p>The FCC-filed quick start lists a 27mm thickness and 21700 lithium cells; the product page lists 22mm and semi-solid cells. We use the product page.</p>
    </section>
    <section id="faq"><h2>Questions &amp; help</h2>
      <details><summary>Can I turn the Ultra off remotely over Wi-Fi?</summary><p>No. PeakDo limits Wi-Fi control to scheduled power on/off and restart, to prevent accidental shutdowns. Use Bluetooth or the button for immediate control.</p></details>
      <details><summary>Does Companion include PeakDo’s Wi-Fi cloud service?</summary><p>Optionally, on iOS. LinkPower for iOS 2.0.1 is designed to link the Ultra to your PeakDo account for remote monitoring, using the same flow as LP3. Nearby Bluetooth monitoring does not require an account.</p></details>
      <details><summary>Where should I start if it won’t connect?</summary><p>Confirm you are using LinkPower 2.0.1 or later, then open our <a href="/troubleshooting/#bluetooth">Bluetooth troubleshooting steps</a>.</p></details>
    </section>
  </LP3Guide>;
}
