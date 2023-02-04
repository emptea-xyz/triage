import * as React from "react";
import { useState } from "react";
//Web3
import { walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { NFTStorage } from "nft.storage";
//Font-Awesome
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { optionUnstyledClasses } from "@mui/base/OptionUnstyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectUnstyled from "@mui/base/SelectUnstyled";
import OptionUnstyled from "@mui/base/OptionUnstyled";
//material-ui
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import OptionGroupUnstyled from "@mui/base/OptionGroupUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
//Notistack
import { useSnackbar } from "notistack";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
//local-components
import Navbar from "../../components/bricks/navbar/Navbar";
import Footer from "../../components/bricks/footer/Footer";
import Link from "next/link";

function index() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);
  const wallet = useWallet();
  metaplex.use(walletAdapterIdentity(wallet));
  const [size, setSize] = useState(false);
  const [type, setType] = useState(false);
  const [format, setFormat] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  const [description, setDescription] = useState(null);
  const [category, setCategory] = useState(11);
  const [edition, setEdition] = useState(null);
  const [title, setTitle] = useState(null);
  const [cover, setCover] = useState(null);
  const [text, setText] = useState(null);

  const [textLink, setTextLink] = useState("");
  const [coverLink, setCoverLink] = useState("");
  const [metadataLink, setMetadataLink] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const [nftApiToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE1Mzg1Nzk3MzIzRDFBNTc3YmQxN0FCRDU2NzAwNjE5NWQ5YzY5ODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDIyMjQyNTQ0OCwibmFtZSI6IkVtcHRlYSBUb2tlbml6ZXIifQ.-bFsgzIY6TOY_dmUsyRa0upv-Z0g9Ox3K5BCbzkrrws"
  ); //hooks
  //components
  const Button = React.forwardRef(function Button(props, ref) {
    const { ownerState, ...other } = props;
    return (
      <button type="button" {...other} ref={ref}>
        {other.children}
        <UnfoldMoreRoundedIcon />
      </button>
    );
  });
  const StyledButton = styled(Button, { shouldForwardProp: () => true })(
    ({ theme }) => `
    font-family: Inter Tight Regular;
    font-size: 0.875rem;
    box-sizing: border-box;
    min-height: calc(1.5em + 22px);
    min-width: 320px;

    padding: 12px;
    border-radius: 12px;
    text-align: left;
    line-height: 1.5;
    background: var(--black);
    border: 0px solid var(--black);
    color: var(--white);
    position: relative;
  
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background:  var(--white);
      color: var(--black);
    }
  
    & > svg {
      font-size: 1rem;
      position: absolute;
      height: 100%;
      top: 0;
      right: 10px;
    }
    `
  );
  const StyledListbox = styled("ul")(
    ({ theme }) => `
    font-family: Inter Tight Regular;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 320px;
    max-height: 300px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: var(--black);
    border: 0px solid var(--black);
    color: var(--white);
    `
  );
  const StyledOption = styled(OptionUnstyled)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${optionUnstyledClasses.selected} {
      background-color: var(--white);
      color: var(--black);
    }
  
    &.${optionUnstyledClasses.highlighted} {
      background-color: var(--white);
      color: var(--black);
    }
  
    &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
      background-color: var(--white);
      color: var(--black);
    }
  
    &:hover:not(.${optionUnstyledClasses.disabled}) {
      background-color: var(--white);
      color: var(--black);
    }
    `
  );
  const StyledGroupRoot = styled("li")`MobileOption
    list-style: none;
  `;
  const StyledGroupHeader = styled("span")`
    display: block;
    padding: 15px 0 5px 10px;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    color: var(--sign);
  `;
  const StyledGroupOptions = styled("ul")`
    list-style: none;
    margin-left: 0;
    padding: 0;

    > li {
      padding-left: 20px;
    }
  `;
  const StyledPopper = styled(PopperUnstyled)`
    z-index: 1;
  `;
  const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
    const slots = {
      root: StyledButton,
      listbox: StyledListbox,
      popper: StyledPopper,
      ...props.slots,
    };

    return <SelectUnstyled {...props} ref={ref} slots={slots} />;
  });
  const CustomOptionGroup = React.forwardRef(function CustomOptionGroup(
    props,
    ref
  ) {
    const slots = {
      root: StyledGroupRoot,
      label: StyledGroupHeader,
      list: StyledGroupOptions,
      ...props.slots,
    };

    return <OptionGroupUnstyled {...props} ref={ref} slots={slots} />;
  });
  //start mobile
  const MobileButton = styled(Button, { shouldForwardProp: () => true })(
    ({ theme }) => `
    font-family: Inter Tight Regular;
    font-size: 0.875rem;
    box-sizing: border-box;
    min-height: calc(1.5em + 22px);
    min-width: calc(80vw - 60px);

    padding: 12px;
    border-radius: 12px;
    text-align: left;
    line-height: 1.5;
    background: var(--black);
    border: 0px solid var(--black);
    color: var(--white);
    position: relative;
  
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background:  var(--white);
      color: var(--black);
    }
  
    & > svg {
      font-size: 1rem;
      position: absolute;
      height: 100%;
      top: 0;
      right: 10px;
    }
    `
  );
  const MobileListbox = styled("ul")(
    ({ theme }) => `
    font-family: Inter Tight Regular;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 10px;
    margin: 12px 0;
    min-width:  calc(80vw - 60px);
    max-height: 300px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: var(--black);
    border: 0px solid var(--black);
    color: var(--white);
    `
  );
  const MobileOption = styled(OptionUnstyled)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${optionUnstyledClasses.selected} {
      background-color: var(--white);
      color: var(--black);
    }
  
    &.${optionUnstyledClasses.highlighted} {
      background-color: var(--white);
      color: var(--black);
    }
  
    &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
      background-color: var(--white);
      color: var(--black);
    }
  
    &:hover:not(.${optionUnstyledClasses.disabled}) {
      background-color: var(--white);
      color: var(--black);
    }
    `
  );
  const MobileGroupRoot = styled("li")`
    list-style: none;
  `;
  const MobileGroupHeader = styled("span")`
    display: block;
    padding: 15px 0 5px 10px;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    color: var(--sign);
  `;
  const MobileGroupOptions = styled("ul")`
    list-style: none;
    margin-left: 0;
    padding: 0;

    > li {
      padding-left: 20px;
    }
  `;
  const MobilePopper = styled(PopperUnstyled)`
    z-index: 1;
  `;
  const MobileSelect = React.forwardRef(function CustomSelect(props, ref) {
    const slots = {
      root: MobileButton,
      listbox: MobileListbox,
      popper: MobilePopper,
      ...props.slots,
    };

    return <SelectUnstyled {...props} ref={ref} slots={slots} />;
  });
  const MobileOptionGroup = React.forwardRef(function CustomOptionGroup(
    props,
    ref
  ) {
    const slots = {
      root: MobileGroupRoot,
      label: MobileGroupHeader,
      list: MobileGroupOptions,
      ...props.slots,
    };

    return <OptionGroupUnstyled {...props} ref={ref} slots={slots} />;
  });
  const categories = [
    //Education
    "Biology",
    "Computer science",
    "Economy",
    "History",
    "Philosophy",
    "Physics",
    "Psychology",
    "Sports",
    //Non-Fiction
    "Biography",
    "Business",
    "Finances",
    "Lifestyle",
    "Mental health",
    "Mindset",
    //Fiction
    "Fantasy",
    "Horror",
    "Manga",
    "Mythology",
    "Novels",
    "Romantic",
  ];

  //components
  //functions

  function checkImage() {
    const fileInput = document.getElementById("file-input-cover");
    if (fileInput.files.length > 0) {
      console.log(fileInput.files);
      if (fileInput.files[0].type.toString() == "image/png") {
        setType(true);
      } else setType(false);

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
          const w = this.width;
          const h = this.height;
          console.log(w);
          console.log(h);
          if (w > 100 && h > 100) {
            if (w - h == 0) {
              setFormat(true);
            } else setFormat(false);

            if (w <= 2000 && h <= 2000) {
              setCover(fileInput.files);
              setCoverPreview([reader.result]);
              setSize(true);
            } else setSize(false);
          }
        };
      };
      reader.readAsDataURL(fileInput.files.item(0));
    }
  }

  async function uploadText() {
    try {
      const client = new NFTStorage({
        token: nftApiToken,
      });
      const blob = new Blob([text], { type: "text/markdown" });
      const cid = await client.storeBlob(blob);
      console.log("Text: https://" + cid + ".ipfs.nftstorage.link");
      return "https://" + cid + ".ipfs.nftstorage.link";
    } catch (e) {
      enqueueSnackbar(e.toString());
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
  async function uploadMetadata({ cover, text }) {
    const token = nftApiToken;
    try {
      const client = new NFTStorage({ token });
      const object = {
        name: title,
        description: description,
        symbol: "BOOK",
        image: cover,
        external_url: "https://library.emptea.xyz",
        attributes: [
          { trait_type: "edition", value: edition },
          { trait_type: "category", value: categories[category] },
        ],
        properties: {
          files: [
            {
              uri: text,
              type: "text/markdown",
            },
          ],
        },
      };
      const json = JSON.stringify(object);
      const blob = new Blob([json], { type: "text/json" });
      const cid = await client.storeBlob(blob);
      console.log("Metadata: https://" + cid + ".ipfs.nftstorage.link");
      return "https://" + cid + ".ipfs.nftstorage.link";
    } catch (e) {
      console.log(e.toString());
    }
  }

  async function mint() {
    if (wallet.connected) {
      enqueueSnackbar("Creating...");
      const text = await uploadText();
      const cover = await uploadCover();
      const metadata = await uploadMetadata({ cover, text });
      try {
        await metaplex.nfts().create({
          uri: metadata,
          name: title,
          symbol: "BOOK",
          sellerFeeBasisPoints: 500,
        });
        enqueueSnackbar("Done! Check your wallet.");
      } catch (e) {
        enqueueSnackbar(e.toString());
      }
    }
  }

  return (
    <>
      <Navbar id={0} />
      <div className="create">
        <div className="create-board-wrapper">
          <div className="create-board">
            <div className="create-editor">
              <textarea
                name="create-editor"
                id="create-editor"
                cols="30"
                rows="10"
                placeholder="Write your post and scroll down if you're done."
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            <div className="create-preview">
              <ReactMarkdown children={text} remarkPlugins={remarkGfm} />
            </div>
          </div>
          <div className="create-board-info-wrapper">
            <div className="create-board-info">
              <FontAwesomeIcon icon={faInfoCircle} /> We use markdown format, to
              write faster and better.{" "}
              <Link
                href={"https://www.markdownguide.org/cheat-sheet/"}
                target="_blank"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="create">
        <div className="create-wrapper">
          <div className="create-panel">
            <div className="create-panel-left">
              <div className="create-panel-left-content">
                <div className="create-cover">
                  <div className="create-cover-input">
                    <button
                      onClick={() =>
                        document.getElementById("file-input-cover").click()
                      }
                      className="create-cover-input-button"
                    >
                      {coverPreview ? (
                        <img src={coverPreview} />
                      ) : (
                        <div>
                          Click to add your cover. (Square format, max. 1500px
                          x1500px)
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
                <div className="create-main-description">
                  <div className="create-title">
                    <input
                      type="text"
                      placeholder="Enter your title"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                  <div className="create-author">
                    <p>@johndoe</p>
                  </div>
                  <div className="create-description">
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
            <div className="create-panel-right">
              <div className="create-panel-right-content">
                <div className="create-metadata">
                  <div className="metadata">
                    <div className="metadata-title">Edition</div>
                    <div className="metadata-data">
                      <input
                        type="text"
                        name="edition"
                        id="create-edition-input"
                        placeholder="E.g: Standard Edition"
                        maxLength={20}
                        onChange={(e) => {
                          setEdition(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="metadata">
                    <div className="metadata-title">Category</div>
                    <div className="metadata-select">
                      <CustomSelect
                        defaultValue={category}
                        onChange={(e, newValue) => setCategory(newValue)}
                      >
                        <CustomOptionGroup label="Education">
                          <StyledOption value={0}>Biology</StyledOption>
                          <StyledOption value={1}>
                            Computer science
                          </StyledOption>
                          <StyledOption value={2}>Economy</StyledOption>
                          <StyledOption value={3}>History</StyledOption>
                          <StyledOption value={4}>Philosophy</StyledOption>
                          <StyledOption value={5}>Physics</StyledOption>
                          <StyledOption value={6}>Psychology</StyledOption>
                          <StyledOption value={7}>Sports</StyledOption>
                        </CustomOptionGroup>
                        <CustomOptionGroup label="Non-fiction">
                          <StyledOption value={8}>Biography</StyledOption>
                          <StyledOption value={9}>Business</StyledOption>
                          <StyledOption value={10}>Finances</StyledOption>
                          <StyledOption value={11}>Lifestyle</StyledOption>
                          <StyledOption value={12}>Mental health</StyledOption>
                          <StyledOption value={13}>Mindset</StyledOption>
                        </CustomOptionGroup>
                        <CustomOptionGroup label="Fiction">
                          <StyledOption value={14}>Fantasy</StyledOption>
                          <StyledOption value={15}>Horror</StyledOption>
                          <StyledOption value={16}>Manga</StyledOption>
                          <StyledOption value={17}>Mythology</StyledOption>
                          <StyledOption value={18}>Novels</StyledOption>
                          <StyledOption value={19}>Romantic</StyledOption>
                        </CustomOptionGroup>
                      </CustomSelect>
                    </div>
                    <div className="metadata-select-mobile">
                      <MobileSelect
                        defaultValue={category}
                        onChange={(e, newValue) => setCategory(newValue)}
                      >
                        <mobileOptionGroup label="Education">
                          <MobileOption value={0}>Biology</MobileOption>
                          <MobileOption value={1}>
                            Computer science
                          </MobileOption>
                          <MobileOption value={2}>Economy</MobileOption>
                          <MobileOption value={3}>History</MobileOption>
                          <MobileOption value={4}>Philosophy</MobileOption>
                          <MobileOption value={5}>Physics</MobileOption>
                          <MobileOption value={6}>Psychology</MobileOption>
                          <MobileOption value={7}>Sports</MobileOption>
                        </mobileOptionGroup>
                        <MobileOptionGroup label="Non-fiction">
                          <MobileOption value={8}>Biography</MobileOption>
                          <MobileOption value={9}>Business</MobileOption>
                          <MobileOption value={10}>Finances</MobileOption>
                          <MobileOption value={11}>Lifestyle</MobileOption>
                          <MobileOption value={12}>Mental health</MobileOption>
                          <MobileOption value={13}>Mindset</MobileOption>
                        </MobileOptionGroup>
                        <MobileOptionGroup label="Fiction">
                          <MobileOption value={14}>Fantasy</MobileOption>
                          <MobileOption value={15}>Horror</MobileOption>
                          <MobileOption value={16}>Manga</MobileOption>
                          <MobileOption value={17}>Mythology</MobileOption>
                          <MobileOption value={18}>Novels</MobileOption>
                          <MobileOption value={19}>Romantic</MobileOption>
                        </MobileOptionGroup>
                      </MobileSelect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="create-controller">
            <div className="create-controller-checklist">
              <div className="create-controller-checklist-title">
                Requirements
              </div>
              <div className="create-controller-checklist-checkpoint">
                {type == true ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                Cover-file: *.png
              </div>
              <div className="create-controller-checklist-checkpoint">
                {format == true ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                Cover-format: 1 x 1
              </div>
              <div className="create-controller-checklist-checkpoint">
                {size == true ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                Cover-size: 2000 x 2000
              </div>
              <div className="create-controller-checklist-checkpoint">
                {text ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                text
              </div>
              <div className="create-controller-checklist-checkpoint">
                {title ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                title
              </div>
              <div className="create-controller-checklist-checkpoint">
                {description ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                description
              </div>
              <div className="create-controller-checklist-checkpoint">
                {edition ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                edition
              </div>
              <div className="create-controller-checklist-checkpoint">
                {category ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="checked" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="unchecked" />
                )}
                category
              </div>
              <div className="create-controller-checklist-checkpoint"></div>
              <div className="create-controller-checklist-checkpoint"></div>
            </div>
            <div className="create-controller-button">
              {title &&
              description &&
              edition &&
              category &&
              cover &&
              text &&
              size &&
              type &&
              format &&
              coverPreview &&
              wallet.connected ? (
                <button
                  onClick={async () => {
                    await mint();
                  }}
                >
                  Create
                </button>
              ) : wallet.connected ? (
                <button disabled>Fulfill missing requirements</button>
              ) : (
                <button disabled>connect wallet</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default index;
