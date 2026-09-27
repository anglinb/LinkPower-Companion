import { LP3Guide, lp3Metadata, LP3_MANUAL, LP3_WEB_APP, LP3_WIFI } from "../../components/LP3Guide";
export const metadata = lp3Metadata("LinkPower 3 Connection Guide: Bluetooth & Wi-Fi", "Connect LP3 over Bluetooth, or set up PeakDo’s Wi-Fi remote monitoring. Pairing, permissions, account binding, and troubleshooting.", "/linkpower-3-connection-guide/");
const topics = [{ id: "choose", title: "Choose a connection" }, { id: "bluetooth", title: "Bluetooth pairing" }, { id: "wifi", title: "Wi-Fi setup" }, { id: "help", title: "Connection help" }];
export default function Page() {
  return <LP3Guide title="Connect your LinkPower 3" description="Nearby Bluetooth control and PeakDo’s internet-based monitoring are separate connections. Start with the one you need." topics={topics}>
    <section id="choose"><h2>Choose your connection</h2>
      <h3>LinkPower Companion: nearby Bluetooth</h3>
      <p>Use an LP3-enabled build for battery readings and supported port controls from your phone. This connection does not bind your battery to PeakDo’s cloud account.</p>
      <h3>PeakDo’s web app: Bluetooth and Wi-Fi</h3>
      <p>Wi-Fi connects the battery through your Starlink network to PeakDo’s AWS service. Remote monitoring requires internet connectivity at the battery and on your phone. This is different from a local Starlink connection-status check in Companion. <a href={LP3_WIFI}>How PeakDo’s remote monitoring works ↗</a></p>
    </section>
    <section id="bluetooth"><h2>Pair in PeakDo’s web app</h2>
      <ol>
        <li>Open <a href={LP3_WEB_APP}>PeakDo’s LP3 web app</a> in Bluefy on iPhone, or a supported Bluetooth browser such as Chrome on Android.</li>
        <li>Choose Bluetooth connection, select LP3, and approve pairing using the PIN on its LCD.</li>
      </ol>
      <p>These are PeakDo web-app instructions. In Companion, start from the app’s own device scanner instead. Close other battery connections before switching apps.</p>
    </section>
    <section id="wifi"><h2>Set up PeakDo’s Wi-Fi service</h2>
      <ol>
        <li>Connect over Bluetooth first and sign in to PeakDo’s web app.</li>
        <li>Enable Wi-Fi and enter your Starlink network credentials. Ensure 2.4GHz is enabled.</li>
        <li>Enable AWS, bind the device by scanning its LCD QR code, confirm binding, then open Remote Devices.</li>
      </ol>
      <p><a href={LP3_MANUAL}>Illustrated instructions: official manual, pages 19–25.</a> Camera permission is needed for the binding scan.</p>
      <aside>PeakDo’s guide limits Wi-Fi control: do not rely on a manual remote power switch. Check the official interface for available scheduled actions.</aside>
    </section>
    <section id="help"><h2>If connection fails</h2>
      <ul>
        <li><strong>Companion cannot see LP3:</strong> confirm your installed app version supports LP3, enable Bluetooth permission, and try nearby with other controllers closed.</li>
        <li><strong>The official Wi-Fi workflow fails:</strong> use the illustrated guide above to check which step failed. Report account or binding errors to PeakDo; Companion does not manage those accounts.</li>
        <li><strong>USB-C data is missing:</strong> reconnect and allow fresh telemetry to arrive. See our <a href="/troubleshooting/#usb-c">port-reading checklist</a>.</li>
      </ul>
      <p>For Companion issues, <a href="/support/">contact support</a> with your app version, LP3 firmware version if available, and the exact screen or error. For hardware setup, return to the <a href="/linkpower-3-quick-start/">LP3 quick start</a>.</p>
    </section>
  </LP3Guide>;
}
