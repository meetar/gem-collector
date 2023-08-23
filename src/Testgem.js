import { InnerGem } from "./InnerGem"
import { Gem } from "./Gem"

export function Testgem({config, texture, ...props}) {
  console.log('config?', config);
  return (
    <>
      <group scale={0.999}>
        <InnerGem
          config={config}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 1]}
          backgroundTexture={config.HDRTexture ? texture : null}
          visible={config.InnerVisible}
        />
      </group>

      <Gem config={config} backgroundTexture={texture} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 1]} visible={config.GemVisible} />
    </>
  )
}
