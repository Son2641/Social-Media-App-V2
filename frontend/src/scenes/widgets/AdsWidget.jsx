import { Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import WidgetWrapper from '../../components/WidgetWrapper';

const AdsWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant='h5' fontWeight='500'>
          Advertisements
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width='100%'
        height='auto'
        alt='advert'
        src='../assets/ad.jpg'
        style={{ borderRadius: '0.75rem', margin: '0.75rem 0' }}
      />
      <FlexBetween>
        <Typography color={main}>Genshin Impact</Typography>
        <Typography color={medium}>genshin.hoyoverse.com</Typography>
      </FlexBetween>
      <Typography color={medium} m='0.5rem 0'>
        Genshin Impact is an open-world action RPG. Experience an immersive
        single-player campaign. As a traveler from another world, you will
        embark on a journey to reunite with your long-lost sibling and unravel
        the mysteries of Teyvat, and yourself.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdsWidget;
