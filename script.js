const canvas = document.getElementById("resultCanvas");
const ctx = canvas.getContext("2d");

async function getTransferAmounts(txSignature) {
  const solana = new window.solanaWeb3.Connection("https://docs-demo.solana-mainnet.quiknode.pro/");
  const transaction = await solana.getParsedTransaction(txSignature, {
    maxSupportedTransactionVersion: 0,
  });
  const innerInstructions = transaction.meta.innerInstructions;
  const transferAmounts = [];

  for (const innerInstruction of innerInstructions) {
    const instructions = innerInstruction.instructions;
    for (const instruction of instructions) {
      if (instruction.parsed && instruction.parsed.type === "transfer") {
        const amount = instruction.parsed.info.amount;
        transferAmounts.push(amount);
        if (transferAmounts.length === 2) {
          break;
        }
      }
    }
    if (transferAmounts.length === 2) {
      break;
    }
  }

  return transferAmounts;
}

function lamportsToSol(lamports) {
  return Math.round((lamports / 1000000000) * 100) / 100;
}

function generateImage(tx1Amounts, tx2Amounts) {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add your code here to generate the image based on the transaction amounts
  // You can use the canvas API to draw text, shapes, and images

  // Example: Drawing the SOL amounts on the canvas
  ctx.font = "20px Arial";
  ctx.fillText(`TX1 Transfer 1: ${lamportsToSol(tx1Amounts[0])} SOL`, 10, 30);
  ctx.fillText(`TX1 Transfer 2: ${tx1Amounts[1]}`, 10, 60);
  ctx.fillText(`TX2 Transfer 1: ${tx2Amounts[0]}`, 10, 90);
  ctx.fillText(`TX2 Transfer 2: ${lamportsToSol(tx2Amounts[1])} SOL`, 10, 120);
}

document.getElementById("submit").addEventListener("click", async () => {
  console.log("Submit button clicked");
  const tx1Signature = document.getElementById("tx1").value;
  const tx2Signature = document.getElementById("tx2").value;

  const tx1Amounts = await getTransferAmounts(tx1Signature);
  const tx2Amounts = await getTransferAmounts(tx2Signature);

  const isSecondValueMatched = tx1Amounts[1] === tx2Amounts[0];

  if (isSecondValueMatched) {
    generateImage(tx1Amounts, tx2Amounts);
  } else {
    alert("Error: The second value of TX1 does not match the first value of TX2.");
  }
});