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

function index() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);
  const wallet = useWallet();
  metaplex.use(walletAdapterIdentity(wallet));

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metadata, setMetadata] = useState([]);
  const [metadataValidation, setMetadataValidation] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [link, setLink] = useState("");
  const [royalty, setRoyalty] = useState(0);

  const { enqueueSnackbar } = useSnackbar();
  const [nftApiToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE1Mzg1Nzk3MzIzRDFBNTc3YmQxN0FCRDU2NzAwNjE5NWQ5YzY5ODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDIyMjQyNTQ0OCwibmFtZSI6IkVtcHRlYSBUb2tlbml6ZXIifQ.-bFsgzIY6TOY_dmUsyRa0upv-Z0g9Ox3K5BCbzkrrws"
  );

  function formatMetadata(text) {
    const rawstring = text.toString();
    const string = rawstring.replace("\n", "");

    const stringArray = string.split(",");

    const metadataObjectArray = [];
    for (let i = 0; i < stringArray.length; i++) {
      const metadataArray = stringArray[i].split(":");
      if (metadataArray.length != 2) {
        setMetadataValidation(false);
      } else {
        const metadataObject = {
          trait_type: metadataArray[0].replace("\n", ""),
          value: metadataArray[1].replace("\n", ""),
        };
        metadataObjectArray.push(metadataObject);
        setMetadataValidation(true);
      }
    }
    console.log(metadataObjectArray);
  }
  function checkImage() {
    const fileInput = document.getElementById("file-input-cover");
    if (fileInput.files.length > 0) {
      console.log(fileInput.files);
      if (fileInput.files[0].type.toString() == "image/png") {
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
  async function uploadMetadata({ cover }) {
    const token = nftApiToken;
    try {
      const client = new NFTStorage({ token });
      const object = {
        name: title,
        description: description,
        symbol: symbol,
        image: cover,
        external_url: link,
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
          symbol: symbol,
          sellerFeeBasisPoints: royalty,
        });
        enqueueSnackbar("Done! Check your wallet.");
      } catch (e) {}
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
                      accept="image/png"
                      onChange={checkImage}
                    />
                  </div>
                </div>
                <div className="main-description">
                  <div className="title">
                    <input
                      type="text"
                      placeholder="Enter the name"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                  <div className="description">
                    <textarea
                      placeholder="A short description. (max. 200 words)"
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
                <div className="metadata-title">Metadata</div>
                <div className="metadata">
                  <textarea
                    placeholder="Add your metadata. (Format: color:blue,edition:limited )"
                    onChange={(e) => {
                      formatMetadata(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default index;
