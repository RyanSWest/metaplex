import { mintNFTWithKeypair } from './components/testing.ts'

type Props = {}

const testmint = (props: Props) => {
  return (
    <div> </div>
  )
}
const metadata = {
  name: "Test NFT",
  symbol: "TEST",
  uri: "https://arweave.net/some-fake-uri-for-testing", // Use a fake one for now
  sellerFeeBasisPoints: 500,
};

interface Metadata {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
}

interface MintResult {
    // Define the properties returned by mintNFTWithKeypair here
    // For example:
    // txSignature: string;
    // nftAddress: string;
    // etc.
}

declare function mintNFTWithKeypair(
    metadata: Metadata,
    keypairPath: string,
    rpcUrl: string
): Promise<MintResult>;

mintNFTWithKeypair(
    metadata,
    ' C:\Users\bluem\.config\solana\cli\config.yml', // paste the path from solana config get
    'http://127.0.0.1:8899'
)
    .then((result: MintResult) => console.log('Success!', result))
    .catch((err: unknown) => console.error('Error:', err));