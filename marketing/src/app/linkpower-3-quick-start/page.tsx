import { LP3Guide, lp3Metadata, LP3_MANUAL, LP3_PRODUCT } from "../../components/LP3Guide";

export const metadata = lp3Metadata("LinkPower 3 Quick Start: Setup, Charging & Specs", "Set up PeakDo LinkPower 3 for Starlink Mini. Learn about charging, bypass, USB-C readings, and Bluetooth or Wi-Fi control.", "/linkpower-3-quick-start/");
const topics = [
  { id: "overview", title: "What’s new" }, { id: "setup", title: "Setup & activation" },
  { id: "charging", title: "Charging & bypass" }, { id: "connect", title: "Connect your phone" },
  { id: "specs", title: "Specifications" }, { id: "faq", title: "Questions & help" },
];

export default function Page() {
  return <LP3Guide title="LinkPower 3 quick start" description="From unboxing to your first battery reading. A practical guide for using LP3 with Starlink Mini." topics={topics}>
    <section id="overview"><h2>What’s new with LP3</h2>
      <p>LP3 adds Wi-Fi monitoring alongside Bluetooth and physical controls. PeakDo’s cloud service makes battery status available away from camp when both ends have internet access. See <a href="https://www.peakdo.com/blogs/news/why-we-upgraded-linkpower-3s-wi-fi-capabilities">PeakDo’s Wi-Fi overview</a>.</p>
      <p>The battery remains 99Wh. PeakDo advertises 5.5+ hours for Starlink Mini; treat that as a manufacturer test result, not a guaranteed runtime. Conditions and load affect the result. <a href={LP3_PRODUCT}>Product details ↗</a></p>
    </section>
    <section id="setup"><h2>Setup &amp; activation</h2>
      <ol>
        <li>Remove the Mini’s kickstand and connect the supplied DC cable between LP3’s output and the Mini. Seat both plugs fully.</li>
        <li>Connect a USB-C PD supply to activate LP3, then slide the battery into place until it clicks.</li>
        <li>Hold the button about two seconds and release at the flashing light to toggle DC output.</li>
      </ol>
      <aside><strong>Use the correct port.</strong> Never connect a charger to DC output. See the <a href={LP3_MANUAL}>official setup diagrams, pages 4–6</a>.</aside>
      <p>The box includes LP3, a DC cable, and a magnetic DC cable. Check your bundle for any additional accessories.</p>
    </section>
    <section id="charging"><h2>Charging &amp; bypass</h2>
      <p>Charge through USB-C, DC input, or magnetic DC input. USB-C accepts 65W by default, with up to 100W enabled through software; USB-C output is limited to 65W. LP3 supports use while charging and manual or automatic bypass. <a href={LP3_PRODUCT}>PeakDo charging specifications ↗</a></p>
      <p>Use the official manual for your firmware’s button functions and bypass settings. Its descriptions of sleep and shutdown differ between sections, so this guide does not treat those long-press timings as interchangeable.</p>
    </section>
    <section id="connect"><h2>Connect your phone</h2>
      <p>In LinkPower Companion for iOS 2.0 or later, allow Bluetooth, scan for your battery, and connect. Check the dashboard for battery and port readings. The Android app does not support LP3 yet.</p>
      <p>PeakDo’s Wi-Fi account binding is a separate workflow. Follow our <a href="/linkpower-3-connection-guide/">LP3 Bluetooth &amp; Wi-Fi connection guide</a> for the official web app.</p>
    </section>
    <section id="specs"><h2>LP3 specifications</h2>
      <table><caption>From <a href={LP3_PRODUCT}>PeakDo’s current product page</a></caption><tbody>
        <tr><th scope="row">Capacity</th><td>99Wh / 27,500mAh</td></tr>
        <tr><th scope="row">DC input</th><td>12–30V, 65W maximum</td></tr>
        <tr><th scope="row">DC output</th><td>15–21V, 65W maximum</td></tr>
        <tr><th scope="row">Size</th><td>243 × 115 × 27mm</td></tr>
        <tr><th scope="row">Display</th><td>1.47-inch LCD</td></tr>
        <tr><th scope="row">Mount</th><td>¼-inch tripod thread</td></tr>
        <tr><th scope="row">Protection rating</th><td>IP65</td></tr>
      </tbody></table>
    </section>
    <section id="faq"><h2>Questions &amp; help</h2>
      <details><summary>Why is USB-C temperature missing?</summary><p>Some LP3 packets omit USB-C temperature. Our parser accepts voltage and current without that optional reading. A missing temperature alone does not mean charging has stopped.</p></details>
      <details><summary>Does Companion include PeakDo’s Wi-Fi cloud service?</summary><p>Optionally, on iOS. In LinkPower for iOS 2.0 or later, you can sign in to your PeakDo account to link supported batteries and monitor them remotely. Nearby Bluetooth monitoring does not require an account, and PeakDo’s own web app remains available.</p></details>
      <details><summary>Where should I start if it won’t connect?</summary><p>Open our <a href="/troubleshooting/#bluetooth">Bluetooth troubleshooting steps</a>. For a missing USB-C reading, use the <a href="/troubleshooting/#usb-c">USB-C checklist</a>.</p></details>
    </section>
  </LP3Guide>;
}
