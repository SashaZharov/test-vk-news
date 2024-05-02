import { View, SplitLayout, SplitCol } from "@vkontakte/vkui";
import { useActiveVkuiLocation } from "@vkontakte/vk-mini-apps-router";

import { News } from "../page/news";

import { DEFAULT_VIEW_PANELS } from "./routes";
import { Home } from "../page/home";

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } =
    useActiveVkuiLocation();

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" />
          <News id="news" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
