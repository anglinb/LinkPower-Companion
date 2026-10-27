import { LP3Guide, lp3Metadata, LP3_WEB_APP, LP3_WIFI, POD_DEVICE, POD_MANUAL } from "../../components/LP3Guide";
export const metadata = lp3Metadata("LinkPower Pod 1 Connection Guide: Bluetooth & Wi-Fi", "Connect LinkPower Pod 1 over Bluetooth, or set up PeakDo’s Wi-Fi remote monitoring. Pairing, account binding, and troubleshooting.", "/linkpower-pod-connection-guide/");
const topics = [{ id: "choose", title: "Choose a connection" }, { id: "bluetooth", title: "Bluetooth pairing" }, { id: "wifi", title: "Wi-Fi setup" }, { id: "help", title: "Connection help" }];
export default function Page() {
  return <LP3Guide device={POD_DEVICE} title="Connect your LinkPower Pod 1" description="Nearby Bluetooth control and PeakDo’s internet-based monitoring are separate connections. Start with the one you need." topics={topics}>
    <section id="choose"><h2>Choose your connection</h2>
      <h3>LinkPower Companion: nearby Bluetooth</h3>
      <p>Pod support is coming in LinkPower for iOS 2.0.1, now in beta testing. The current App Store version and the Android app cannot connect to the Pod yet. Bluetooth monitoring in Companion does not require a PeakDo account.</p>
      <h3>PeakDo’s web app: Bluetooth and Wi-Fi</h3>
      <p>PeakDo’s Pod guide uses its LP3 web app. Wi-Fi connects the battery through your Starlink network to PeakDo’s cloud service, so remote monitoring needs internet access at the battery and on your phone. <a href={LP3_WIFI}>How PeakDo’s remote monitoring works ↗</a></p>
    </section>
    <section id="bluetooth"><h2>Pair in PeakDo’s web app</h2>
      <ol>
        <li>Scan the QR code on the Pod, or open <a href={LP3_WEB_APP}>PeakDo’s web app</a> in Bluefy on iPhone or a supported Bluetooth browser such as Chrome on Android.</li>
        <li>Choose Bluetooth connection, select the Pod, and tap Pair.</li>
        <li>Approve the pairing request. If it doesn’t appear, enter the code shown on the Pod’s screen. The Bluetooth icon on the Pod turns green once connected.</li>
      </ol>
      <p>These are PeakDo web-app instructions. In Companion, start from the app’s own device scanner instead. Close other battery connections before switching apps.</p>
    </section>
    <section id="wifi"><h2>Set up PeakDo’s Wi-Fi service</h2>
      <ol>
        <li>Connect over Bluetooth first and sign in to PeakDo’s web app.</li>
        <li>Enable Wi-Fi and enter your Starlink network credentials. Ensure 2.4GHz is enabled.</li>
        <li>Bind the battery by scanning the QR code on its screen, confirm binding, then open Remote Devices.</li>
      </ol>
      <p>Camera permission is needed for the binding scan. <a href={POD_MANUAL}>Illustrated steps in the official Pod quick start ↗</a></p>
      <aside>Over Wi-Fi, PeakDo allows only scheduled power on/off and restart. Do not rely on a manual remote power switch.</aside>
    </section>
    <section id="help"><h2>If connection fails</h2>
      <ul>
        <li><strong>Companion cannot see the Pod:</strong> confirm you have LinkPower for iOS 2.0.1 or later, enable Bluetooth permission, and try nearby with other controllers closed.</li>
        <li><strong>A previously paired Pod doesn’t appear:</strong> remove it from your phone’s Bluetooth settings and pair again.</li>
        <li><strong>The official Wi-Fi workflow fails:</strong> check which step failed in the quick start. Report account or binding errors to PeakDo; Companion does not manage those accounts.</li>
      </ul>
      <p>For Companion issues, <a href="/support/">contact support</a> with your app version, Pod firmware version if available, and the exact screen or error. For hardware setup, return to the <a href="/linkpower-pod-quick-start/">Pod quick start</a>.</p>
    </section>
  </LP3Guide>;
}
