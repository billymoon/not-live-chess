import { Fragment } from "react";
import {
  Stack,
  Button,
  LightMode,
  DarkMode,
  useColorModeValue,
} from "@chakra-ui/react";

const ComponentDemo = () => {
  const bg = useColorModeValue(
    "lichess.light.buttonGradientEnd",
    "lichess.dark.buttonGradientEnd"
  );

  return (
    <Stack spacing={4} p={5} direction="row" align="center" bg={bg}>
      <Button size="xs">Button</Button>
      <Button size="sm">Button</Button>
      <Button size="md">Button</Button>
      <Button size="lg">Button</Button>
    </Stack>
  );
};

const Page = () => {
  return (
    <Fragment>
      <ComponentDemo />
      <DarkMode>
        <ComponentDemo />
      </DarkMode>
      <LightMode>
        <ComponentDemo />
      </LightMode>
    </Fragment>
  );
};

export default Page;
