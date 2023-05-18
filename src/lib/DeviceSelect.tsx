import React, { useState } from "react";
import type { Devices } from "./types";

import "./deviceSelect.scss";

interface DeviceSelectProps {
  label: string;
  devices: Devices;
  updateDeviceId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DeviceSelect: React.FC<DeviceSelectProps> = ({
  label,
  devices,
  updateDeviceId,
}) => {
  const [deviceId, setDeviceId] = useState(devices[0].deviceId);

  const options = devices.map(({ deviceId, label }) => (
    <option key={deviceId} value={deviceId}>
      {label}
    </option>
  ));

  return (
    <div className="device-select">
      <label>{label}</label>
      <select
        value={deviceId}
        onChange={(event) => {
          const selectedDeviceId = event.target.value;
          setDeviceId(selectedDeviceId);
          updateDeviceId(selectedDeviceId);
        }}
      >
        {options}
      </select>
    </div>
  );
};

export default DeviceSelect;
