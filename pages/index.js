import * as React from "react";
import { useState } from "react";
//Web3
import { walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { NFTStorage } from "nft.storage";
//Notistack
import { useSnackbar } from "notistack";
//local-components
import Navbar from "../components/bricks/navbar/Navbar";
import Footer from "../components/bricks/footer/Footer";

function Index() {
  const connection = new Connection(
    "https://rpc.helius.xyz/?api-key=6ab23117-c35c-4e3c-94f2-1ec14d058d0d"
  );
  const metaplex = new Metaplex(connection);
  const wallet = useWallet();
  metaplex.use(walletAdapterIdentity(wallet));

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [metadata, setMetadata] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const [nftApiToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE1Mzg1Nzk3MzIzRDFBNTc3YmQxN0FCRDU2NzAwNjE5NWQ5YzY5ODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDIyMjQyNTQ0OCwibmFtZSI6IkVtcHRlYSBUb2tlbml6ZXIifQ.-bFsgzIY6TOY_dmUsyRa0upv-Z0g9Ox3K5BCbzkrrws"
  );

  function formatMetadata(text) {
    const rawstring = text.toString();
    const string = rawstring.replace("\n", "");
    const stringArray = string.split(",");
    const metadataObjectArray = [];

    if (rawstring.length <= 1) {
      setMetadata([]);
    } else {
      for (let i = 0; i < stringArray.length; i++) {
        const metadataArray = stringArray[i].split(":");
        if (metadataArray.length != 2) {
        } else {
          const metadataObject = {
            trait_type: metadataArray[0].replace("\n", ""),
            value: metadataArray[1].replace("\n", ""),
          };
          metadataObjectArray.push(metadataObject);
          setMetadata(metadataObjectArray);
        }
      }
    }
    console.log(metadataObjectArray);
  }
  function checkImage() {
    const fileInput = document.getElementById("file-input-cover");
    if (fileInput.files.length > 0) {
      console.log(fileInput.files);
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          setCover(fileInput.files);
          setCoverPreview([reader.result]);
        };
      };
      reader.readAsDataURL(fileInput.files.item(0));
    }
  }
  async function uploadCover() {
    const token = nftApiToken;

    try {
      if (!cover) {
        enqueueSnackbar("no cover or text selected.");
      } else {
        console.log(cover);
        const client = new NFTStorage({ token });
        const cid = await client.storeDirectory(cover);
        console.log(
          "Cover: https://" + cid + ".ipfs.nftstorage.link" + cover[0].name
        );
        return "https://" + cid + ".ipfs.nftstorage.link/" + cover[0].name;
      }
    } catch (e) {
      enqueueSnackbar(e.toString());
    }
  }
  async function uploadMetadata() {
    const token = nftApiToken;
    enqueueSnackbar("uploading metadata...");
    const cover = await uploadCover();
    console.log("The cover: " + cover);

    try {
      const client = new NFTStorage({ token });
      const object = {
        name: title,
        description: description,
        symbol: "EMPTEA",
        image: cover,
        external_url: "https://emptea.xyz",
        attributes: metadata,
      };
      const json = JSON.stringify(object);
      const blob = new Blob([json], { type: "text/json" });
      const cid = await client.storeBlob(blob);
      return "https://" + cid + ".ipfs.nftstorage.link";
    } catch (e) {
      console.log(e.toString());
    }
  }
  async function mint() {
    if (wallet.connected) {
      enqueueSnackbar("Creating...");
      const _cover = await uploadCover();
      const metadata = await uploadMetadata({ _cover });
      try {
        await metaplex.nfts().create({
          uri: metadata,
          name: title,
          symbol: "EMPTEA",
          sellerFeeBasisPoints: 500,
        });
        enqueueSnackbar("Done! Check your wallet.");
      } catch (e) {}
      enqueueSnackbar("minting...");
    } else {
      await wallet.connect();
    }
  }

  return (
    <>
      <Navbar id={0} />
      <div className="create">
        <div className="wrapper">
          <div className="panel">
            <div className="panel-left">
              <div className="panel-left-content">
                <div className="cover">
                  <div className="cover-input">
                    <button
                      onClick={() =>
                        document.getElementById("file-input-cover").click()
                      }
                      className="cover-input-button"
                    >
                      {coverPreview ? (
                        <img src={coverPreview} />
                      ) : (
                        <div>
                          Click to add the image. (Square format recommended)
                        </div>
                      )}
                    </button>
                    <input
                      type="file"
                      name="cover"
                      id="file-input-cover"
                      accept="image/*"
                      onChange={checkImage}
                    />
                  </div>
                </div>
                <div className="main-description">
                  <div className="title">
                    <input
                      type="text"
                      placeholder="Enter the name."
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                  <div className="description">
                    <textarea
                      placeholder="Add a description."
                      maxLength={200}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-right">
              <div className="panel-right-content">
                <div className="metadata">
                  <textarea
                    placeholder="Add your metadata. (Format: color:blue,edition:limited )"
                    onChange={(e) => {
                      formatMetadata(e.target.value);
                    }}
                  />
                </div>
                <div className="metadata-result">
                  {metadata.map((c) => (
                    <div
                      className="metadata-result-item"
                      key={c.trait_type.toString()}
                    >
                      <div className="metadata-result-item-name">
                        {c.trait_type.toString()}
                      </div>
                      <div className="metadata-result-item-value">
                        {c.value.toString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <div className="mint-button-container">
        <button
          className="mint-button"
          onClick={async () => {
            await mint();
          }}
        >
          Mint
        </button>
      </div>
    </>
  );
}

export default Index;
