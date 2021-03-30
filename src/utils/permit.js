const createPermitMessageData = function (fromAddress, spender, nonce, expiry, value, tokenName, tokenAddress, chainId) {
  const message = {
    owner: fromAddress,
    spender: spender,
    value: value,
    nonce: nonce,
    deadline: expiry
  };

  const typedData = JSON.stringify({
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      "Permit": [{
        "name": "owner",
        "type": "address"
        },
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        },
        {
          "name": "nonce",
          "type": "uint256"
        },
        {
          "name": "deadline",
          "type": "uint256"
        }
      ],
    },
    primaryType: "Permit",
    domain: {
      name: tokenName,
      version: "1",
      chainId: chainId,
      verifyingContract: tokenAddress,
    },
    message: message,
  });

  return {
    typedData,
    message,
  };
};

const signData = async function (web3, fromAddress, typedData) {
  return new Promise(function (resolve, reject) {
    web3.currentProvider.sendAsync(
      {
        id: 1,
        method: "eth_signTypedData_v3",
        params: [fromAddress, typedData],
        from: fromAddress,
      },
      function (err, result) {
        if (err) {
          reject(err); //TODO
        } else {
          const r = result.result.slice(0, 66);
          const s = "0x" + result.result.slice(66, 130);
          const v = Number("0x" + result.result.slice(130, 132));
          resolve({
            v,
            r,
            s,
          });
        }
      }
    );
  });
};

export const signTransferPermit = async function (web3, fromAddress, spender, value, nonce, expiry, tokenName, tokenAddress, chainId) {
  const messageData = createPermitMessageData(fromAddress, spender, nonce, expiry, value, tokenName, tokenAddress, chainId);
  const sig = await signData(web3, fromAddress, messageData.typedData);
  return Object.assign({}, sig, messageData.message);
};
