import { View, ViewProps } from "react-native";
import React, { forwardRef } from "react";

type TimelineDotProps = ViewProps & {
  isLast?: boolean;
};

const TimelineDot = forwardRef<View, TimelineDotProps>(
  ({ style, isLast = false, children, ...props }, ref) => {
    return (
      <View
        style={{
          alignItems: "center",
        }}>
        <View
          ref={ref}
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#d4d4d8",
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            },
            style,
          ]}
          {...props}>
          {children}
        </View>

        {!isLast && (
          <View
            style={{
              flexGrow: 1,
              width: 1,
              backgroundColor: "#d4d4d8",
              marginVertical: 8,
              minHeight: 24,
            }}
          />
        )}
      </View>
    );
  }
);

TimelineDot.displayName = "TimelineDot";

export { TimelineDot };
