import { z } from "zod";
import fetch from "node-fetch";
import { Attribute } from "../types/proto-interfaces/cosmos/base/abci/v1beta1/abci";
import { ContentSchemaId, TrackSchema, contentWith } from "@bitsongjs/metadata"

export const fromNanoSeconds = (longTimestamp: string) => {
  return Math.floor(parseInt(longTimestamp) / 1e6);
}

export const getContractAddressesByCodeId = (attributes: readonly Attribute[], codeId: string): string[] => {
  const addresses: string[] = [];

  attributes.forEach((attribute, index) => {
    if (attribute.key === "code_id" && attribute.value === codeId) {
      const prevAttr = attributes[index - 1];
      if (prevAttr && prevAttr.key === "_contract_address") {
        addresses.push(prevAttr.value);
      }
    }
  });

  return addresses;
};
interface TxAttribute {
  contractAddress: string;
  type: string;
  referral: string;
  referral_amount: string;
  royalties: string;
  royalties_recipient: string;
  protocol_fee: string;
  token_ids: string[];
  price: string;
  denom: string;
  recipient: string;
  refund: string;
}

export const getMintAttributes = (attributes: readonly Attribute[]): TxAttribute[] => {
  const mintAttributes: TxAttribute[] = [];

  attributes.forEach((attribute, index) => {
    if (attribute.key === "action" && attribute.value === "mint_bs721_curve_nft") {
      const refundPresent = attributes[index - 1].key === "refund";
      const referralPresent = attributes[index - (refundPresent ? 5 : 4)].key === "referral_amount";

      const contractAddress = referralPresent ? attributes[index - (refundPresent ? 7 : 6)].value : attributes[index - (refundPresent ? 5 : 4)].value;
      const referral = referralPresent ? attributes[index - (refundPresent ? 6 : 5)].value : "";
      const referral_amount = referralPresent ? attributes[index - (refundPresent ? 5 : 4)].value : "0";
      const royalties = attributes[index - (refundPresent ? 4 : 3)].value;
      const royalties_recipient = attributes[index - (refundPresent ? 3 : 2)].value;
      const protocol_fee = attributes[index - (refundPresent ? 2 : 1)].value;
      const token_ids = attributes[index + 1].value.split(",");
      const price = attributes[index + 2].value;
      const denom = attributes[index + 3].value;
      const recipient = attributes[index + 5].value;

      mintAttributes.push({
        contractAddress,
        type: "mint",
        referral,
        referral_amount,
        royalties,
        royalties_recipient,
        protocol_fee,
        token_ids,
        price,
        denom,
        recipient,
        refund: refundPresent ? attributes[index - 1].value : "0",
      });
    }
  });

  return mintAttributes;
}

export const getBurnAttributes = (attributes: readonly Attribute[]): TxAttribute[] => {
  const burnAttributes: TxAttribute[] = [];

  attributes.forEach((attribute, index) => {
    if (attribute.key === "action" && attribute.value === "burn_bs721_curve_nft") {
      const referralPresent = attributes[index - 4].key === "referral_amount";

      const contractAddress = referralPresent ? attributes[index - 6].value : attributes[index - 4].value;
      const referral = referralPresent ? attributes[index - 5].value : "";
      const referral_amount = referralPresent ? attributes[index - 4].value : "0";
      const royalties = attributes[index - 3].value;
      const royalties_recipient = attributes[index - 2].value;
      const protocol_fee = attributes[index - 1].value;
      const token_ids = attributes[index + 1].value.split(",");
      const price = attributes[index + 2].value;
      const denom = attributes[index + 3].value;
      const recipient = attributes[index + 5].value;

      burnAttributes.push({
        contractAddress,
        type: "burn",
        referral,
        referral_amount,
        royalties,
        royalties_recipient,
        protocol_fee,
        token_ids,
        price,
        denom,
        recipient,
        refund: "0",
      });
    }
  });

  return burnAttributes;
}