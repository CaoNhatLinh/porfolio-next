"use client";

import { useEffect, useState } from "react";
import { DEFAULT_REWARD, readReward, saveReward, type ArcadeReward } from "../../features/orange-protocol/reward";
import { FlappyOrange } from "./flappy-orange";
import { OrangeProtocol } from "./orange-protocol";
import { protocolEnabled } from "../../features/orange-protocol/config";

export function PlayroomArcade({ locale }: { locale: "vi" | "en" }) {
  const [reward, setReward] = useState(DEFAULT_REWARD);
  const [storageBlocked, setStorageBlocked] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReward(readReward()));
    return () => cancelAnimationFrame(frame);
  }, []);
  function updateReward(next: ArcadeReward) {
    setReward(next);
    setStorageBlocked(!saveReward(next));
  }
  return <><FlappyOrange locale={locale} night={reward.night} skin={reward.skin} />{protocolEnabled ? <OrangeProtocol locale={locale} reward={reward} onReward={updateReward} storageBlocked={storageBlocked} /> : null}</>;
}
