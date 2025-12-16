
import React from "react";

export type GroupItem = {
  id: number;
  name: string;
  unite?: string;
  generalComment?: string;
  description?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  groupName: string;
  items: GroupItem[];
};

export default function GroupDialog(_props: Props) {
  return null;
}

