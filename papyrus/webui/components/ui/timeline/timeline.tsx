import { View, ViewProps } from "react-native";
import React, { forwardRef } from "react";

type TimelineProps = ViewProps;

const Timeline = forwardRef<View, TimelineProps>(({ style, ...props }, ref) => {
  return (
    <View
      ref={ref}
      style={[
        {
          display: "flex",
          flexDirection: "column",
          rowGap: 0,
        },
        style,
      ]}
      {...props}
    />
  );
});

Timeline.displayName = "Timeline";

export { Timeline };
