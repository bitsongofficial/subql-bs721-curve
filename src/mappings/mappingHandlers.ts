import { CosmosEvent } from "@subql/types-cosmos";
import { fromNanoSeconds, getBurnAttributes, getContractAddressesByCodeId, getMintAttributes } from "./utils";
import { Marketplace, Transaction } from "../types";

export async function handleInstantiate(event: CosmosEvent): Promise<void> {
  try {
    const contractAddresses = getContractAddressesByCodeId(event.event.attributes, "4");

    const { sender } = event.msg.msg.decodedMsg

    logger.info(`Contract Address: `)
    logger.info(`  ${contractAddresses.join(", ")}`)

    logger.info(`Sender: `)
    logger.info(`  ${sender}`)

    for (const address of contractAddresses) {
      const {
        bs721_address,
        max_edition,
        max_per_address,
        name,
        payment_address,
        payment_denom,
        protocol_fee_bps,
        ratio,
        referral_fee_bps,
        seller_fee_bps,
        start_time,
        symbol,
        uri
      } = await api.queryContractSmart(address, { get_config: {} });

      logger.info(`New Marketplace: `)
      logger.info(`  ${address}`)

      const marketplace = Marketplace.create({
        id: address,
        nft_address: bs721_address,
        max_edition,
        max_per_address,
        name,
        payment_address,
        payment_denom,
        protocol_fee_bps,
        ratio,
        referral_fee_bps,
        seller_fee_bps,
        start_time: new Date(fromNanoSeconds(start_time)),
        symbol,
        sender,
        uri,
        createdAt: event.block.block.header.time,
        blockHeight: event.block.block.header.height,
        txHash: event.tx.hash,
      })

      await marketplace.save()
    }
  } catch (e) {
    logger.error(`Error while processing handleInstantiate: ${e}`)
  }
}

export async function handleMint(event: CosmosEvent): Promise<void> {
  try {
    const attributes = getMintAttributes(event.event.attributes);
    logger.info(`Mint Attributes: ${attributes.length}`)

    for (const attribute of attributes) {
      logger.info(`Id: ${event.tx.hash}-${event.msg.idx}`)
      logger.info(`MarketplaceId: ${attribute.contractAddress}`)
      logger.info(`TxType: mint`)
      logger.info(`Recipient: ${attribute.recipient}`)
      logger.info(`Quantity: ${BigInt(attribute.token_ids.length)}`)
      logger.info(`TokenIds: ${attribute.token_ids}`)
      logger.info(`Denom: ${attribute.denom}`)
      logger.info(`Price: ${BigInt(attribute.price)}`)
      logger.info(`Refund: ${BigInt(attribute.refund)}`)
      logger.info('Referral: ' + attribute.referral)
      logger.info(`Referral Amount: ${BigInt(attribute.referral_amount)}`)
      logger.info(`Royalties: ${BigInt(attribute.royalties)}`)
      logger.info(`Royalties Recipient: ${attribute.royalties_recipient}`)
      logger.info(`Protocol Fee: ${BigInt(attribute.protocol_fee)}`)
      logger.info(`Block Height: ${event.block.block.header.height}`)
      logger.info(`Tx Hash: ${event.tx.hash}`)
      logger.info(`Created At: ${event.block.block.header.time}`)

      const tx = Transaction.create({
        id: `${event.tx.hash}-${event.msg.idx}`,
        marketplaceId: attribute.contractAddress,
        txType: attribute.type,
        recipient: attribute.recipient,
        quantity: BigInt(attribute.token_ids.length),
        token_ids: attribute.token_ids,
        denom: attribute.denom,
        price: BigInt(attribute.price),
        refund: BigInt(attribute.refund),
        referral: attribute.referral,
        referral_amount: BigInt(attribute.referral_amount),
        royalties: BigInt(attribute.royalties),
        royalties_recipient: attribute.royalties_recipient,
        protocol_fee: BigInt(attribute.protocol_fee),
        blockHeight: event.block.block.header.height,
        txHash: event.tx.hash,
        createdAt: event.block.block.header.time,
      })
      await tx.save()
    }
  } catch (e) {
    logger.error(`Error while processing handleMint: ${e}`)
  }
}

export async function handleBurn(event: CosmosEvent): Promise<void> {
  try {
    const attributes = getBurnAttributes(event.event.attributes);
    logger.info(`Burn Attributes: ${attributes.length}`)

    for (const attribute of attributes) {
      logger.info(`Id: ${event.tx.hash}-${event.msg.idx}`)
      logger.info(`MarketplaceId: ${attribute.contractAddress}`)
      logger.info(`TxType: ${attribute.type}`)
      logger.info(`Recipient: ${attribute.recipient}`)
      logger.info(`Quantity: ${BigInt(attribute.token_ids.length)}`)
      logger.info(`TokenIds: ${attribute.token_ids}`)
      logger.info(`Denom: ${attribute.denom}`)
      logger.info(`Price: ${BigInt(attribute.price)}`)
      logger.info(`Refund: ${BigInt(attribute.refund)}`)
      logger.info('Referral: ' + attribute.referral)
      logger.info(`Referral Amount: ${BigInt(attribute.referral_amount)}`)
      logger.info(`Royalties: ${BigInt(attribute.royalties)}`)
      logger.info(`Royalties Recipient: ${attribute.royalties_recipient}`)
      logger.info(`Protocol Fee: ${BigInt(attribute.protocol_fee)}`)
      logger.info(`Block Height: ${event.block.block.header.height}`)
      logger.info(`Tx Hash: ${event.tx.hash}`)
      logger.info(`Created At: ${event.block.block.header.time}`)

      const tx = Transaction.create({
        id: `${event.tx.hash}-${event.msg.idx}`,
        marketplaceId: attribute.contractAddress,
        txType: attribute.type,
        recipient: attribute.recipient,
        quantity: BigInt(attribute.token_ids.length),
        token_ids: attribute.token_ids,
        denom: attribute.denom,
        price: BigInt(attribute.price),
        refund: BigInt(attribute.refund),
        referral: attribute.referral,
        referral_amount: BigInt(attribute.referral_amount),
        royalties: BigInt(attribute.royalties),
        royalties_recipient: attribute.royalties_recipient,
        protocol_fee: BigInt(attribute.protocol_fee),
        blockHeight: event.block.block.header.height,
        txHash: event.tx.hash,
        createdAt: event.block.block.header.time,
      })
      await tx.save()
    }
  } catch (e) {
    logger.error(`Error while processing handleMint: ${e}`)
  }
}