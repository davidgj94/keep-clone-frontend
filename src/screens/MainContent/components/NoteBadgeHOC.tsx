import React, { useState } from 'react';

import PushPinIcon from '@mui/icons-material/PushPin';
import Badge from '@mui/material/Badge';
import { flow } from 'lodash';

const NoteBadgeHOC = React.forwardRef(
  (
    {
      children,
      badgeVisible,
      onBadgeClick,
    }: {
      children: React.ReactElement;
      badgeVisible: boolean;
      onBadgeClick: () => void;
    },
    ref
  ) => {
    const [showBadge, setShowBadge] = useState(false);
    return (
      <Badge
        component="div"
        badgeContent={<PushPinIcon sx={{ fontSize: '1.5em' }} />}
        invisible={!(badgeVisible || showBadge)}
        color="secondary"
        // @ts-expect-error error
        ref={ref}
        onClick={flow([(e) => e.stopPropagation(), onBadgeClick])}
        onMouseEnter={() => setShowBadge(true)}
        onMouseLeave={() => setShowBadge(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {children}
      </Badge>
    );
  }
);

NoteBadgeHOC.displayName = 'NoteBadgeHOC';

export default NoteBadgeHOC;
