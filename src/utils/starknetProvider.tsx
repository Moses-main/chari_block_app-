import { InjectedConnector } from "starknetkit/injected";
import { StarknetConfig } from "@starknet-react/core";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet, sepolia } from "@starknet-react/chains";
import { publicProvider } from "@starknet-react/core";
// import { voyager } from "@starknet-react/chains/explorers";

type Props = { children: React.ReactNode };

function StarknetProvider({ children }: Props) {
  const connectors = [
    new InjectedConnector({
      options: { id: "argentX", name: "Ready Wallet (formerly Argent)" },
    }),
    new InjectedConnector({
      options: { id: "braavos", name: "Braavos" },
    }),
    new WebWalletConnector(),
    // optional if you want to support web wallet
  ];
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      //   explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}

export default StarknetProvider;
