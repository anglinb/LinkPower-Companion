import { LP3Guide, lp3Metadata, POD_DEVICE, POD_MANUAL, POD_PRODUCT } from "../../components/LP3Guide";

export const metadata = lp3Metadata("LinkPower Pod 1 Quick Start: Setup, Stacking & Specs", "Set up PeakDo LinkPower Pod 1 for Starlink Mini. Activation, charging, stacking two Pods, button controls, Bluetooth or Wi-Fi, and specifications.", "/linkpower-pod-quick-start/");
const topics = [
  { id: "overview", title: "What’s different" }, { id: "setup", title: "Setup & activation" },
  { id: "charging", title: "Charging & stacking" }, { id: "buttons", title: "Button controls" },
  { id: "connect", title: "Connect your phone" }, { id: "specs", title: "Specifications" }, { id: "faq", title: "Questions & help" },
];

export default function Page() {
  return <LP3Guide device={POD_DEVICE} title="LinkPower Pod 1 quick start" description="From unboxing to your first battery reading. A practical guide for using the Pod with Starlink Mini." topics={topics}>
    <section id="overview"><h2>What’s different about the Pod</h2>
      <p>The Pod 1 is a cylindrical LP3-generation battery with a built-in tripod. It mounts to the Mini with a Starlink pipe adapter, and two Pods can be stacked for more runtime. It has Bluetooth and Wi-Fi monitoring and uses PeakDo’s LP3 web app.</p>
      <p>PeakDo advertises 4.5+ hours for Starlink Mini at 20W; treat that as a manufacturer test result, not a guaranteed runtime. <a href={POD_PRODUCT}>Product details ↗</a></p>
    </section>
    <section id="setup"><h2>Setup &amp; activation</h2>
      <ol>
        <li>Remove the Mini’s kickstand and connect the supplied DC cable between the Pod’s DC output and the Mini. Seat both plugs fully.</li>
        <li>Activate the Pod before first use: connect a USB-C PD supply, or hold the power button for 6 seconds until the screen turns on.</li>
        <li>Attach the Mini with a Starlink pipe adapter, check that it doesn’t wobble, then unfold the tripod.</li>
      </ol>
      <aside><strong>Use the correct port.</strong> The DC port is output only. Never connect a charger to it. See the <a href={POD_MANUAL}>official setup diagrams</a>.</aside>
    </section>
    <section id="charging"><h2>Charging &amp; stacking</h2>
      <p>Charge through USB-C while the Mini stays powered. USB-C accepts 65W by default, with up to 100W enabled through software; USB-C output is limited to 65W, so the Pod also works as a regular power bank.</p>
      <p>To stack two Pods, remove the top cover of one and the bottom cover of the other by turning their colored locking rings counterclockwise. Align the connectors and turn a ring clockwise to lock. When stacked, DC output draws from both Pods; each USB-C port only uses its own Pod’s battery.</p>
    </section>
    <section id="buttons"><h2>Button controls</h2>
      <ul>
        <li><strong>DC output on/off:</strong> hold about 2 seconds and release when the light flashes.</li>
        <li><strong>Power on or off:</strong> hold about 6 seconds. The light flashes at 2 seconds (DC toggle) and again at 6 seconds.</li>
        <li><strong>Wake the screen:</strong> press once. <strong>Next screen:</strong> press twice quickly.</li>
        <li><strong>Force restart:</strong> hold 15 seconds if the Pod freezes or won’t charge.</li>
      </ul>
    </section>
    <section id="connect"><h2>Connect your phone</h2>
      <p>Pod support is coming in LinkPower for iOS 2.0.1, now in beta testing, and is still being verified with real hardware. The current App Store version cannot connect to the Pod, and the Android app does not support it yet. Until 2.0.1 ships, use PeakDo’s web app.</p>
      <p>Pairing uses a code shown on the Pod’s screen. Wi-Fi account binding is a separate workflow: see the <a href="/linkpower-pod-connection-guide/">Pod Bluetooth &amp; Wi-Fi connection guide</a>.</p>
    </section>
    <section id="specs"><h2>Pod 1 specifications</h2>
      <table><caption>From <a href={POD_PRODUCT}>PeakDo’s current product page</a></caption><tbody>
        <tr><th scope="row">Capacity</th><td>99Wh / 27,500mAh</td></tr>
        <tr><th scope="row">DC output</th><td>15–21V, 65W maximum</td></tr>
        <tr><th scope="row">USB-C</th><td>65W in by default (100W via software), 65W out</td></tr>
        <tr><th scope="row">Size</th><td>251mm × Ø60mm</td></tr>
        <tr><th scope="row">Weight</th><td>About 835g</td></tr>
        <tr><th scope="row">Display</th><td>1.47-inch LCD</td></tr>
        <tr><th scope="row">Mount</th><td>Built-in tripod and ¼-inch thread</td></tr>
        <tr><th scope="row">Protection rating</th><td>IP65</td></tr>
      </tbody></table>
    </section>
    <section id="faq"><h2>Questions &amp; help</h2>
      <details><summary>How do stacked Pods appear in the app?</summary><p>We haven’t verified this with stacked hardware yet. If you test it, <a href="/support/">tell us</a> what the app shows.</p></details>
      <details><summary>Can I turn the Pod off remotely over Wi-Fi?</summary><p>No. PeakDo limits Wi-Fi control to scheduled power on/off and restart. Use Bluetooth or the button for immediate control.</p></details>
      <details><summary>Where should I start if it won’t connect?</summary><p>Confirm you are using LinkPower 2.0.1 or later, then open our <a href="/troubleshooting/#bluetooth">Bluetooth troubleshooting steps</a>.</p></details>
    </section>
  </LP3Guide>;
}
