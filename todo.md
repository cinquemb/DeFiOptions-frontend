
yarn build --no-lint; cd build/; git init; git remote add origin git@github.com:cinquemb/uniswap-interface.git; git add -A; git commit -m "deployment to GH Pages"; git push origin -f master:gh-pages; cd ..;

cd dist/; git init; git add -A; git commit -m "deployment to GH Pages"; git push -f git@github.com:cinquemb/DeFiOptions-frontend.git master:gh-pages; cd ..;


- issues
	- issue with rebalanicing alredy open position
	- empty proposal being created when not setting all fields of setParams
		- fix ui to not create Proposal when all fields are not set for setParams

	
	- issue with bad oracle inialzation decimals?
		- causes bad vol calcs
			- try building samples from purely on chain
		- need a better way to initialize on chain
			- in udlfeed contracts

	- issue with options visulaizer
		- react date time picker color blends into background
		- submit order button
			- display loadin icon on button press
			- remove loading icon after button submit
		
		- dissapears when using it, then going to another screen, then going back to it again in the lp page
		
		- better buton click response

		- cancel limit order
			- remove option symbol
			- withdraw funds from pool

- other hedging managers
	-https://d8x.gitbook.io/d8x/deployments/polygon-testnet-mumbai
	- d8x hedging manager
		- redeploy pyth wrapper oracles compatiable with d8x hedging
			- btc and eth only

	- money market folding

		- (flash loans that replicate money market folding)
			- "While the recursive-deposit method has a certain aesthetic appeal, transaction costs and slippage limit its utility in practice. Flash loans, which must be repaid within a single transaction but can provide arbitrary amounts of temporary capital, offer a more elegant solution. We can obtain the same leverage as above by flash-loaning Cr/(1 − r) to an address holding C, depositing all funds as collateral, and borrowing Cr/(1 − r) to repay the flash loan. We then have a debt position of Cr/(1 − r) against collateral of C/(1 − r), providing a leverage ratio of 1/(1 − r). Again, this method creates a $5M long position against a $4M short using only $1M in starting equity."
				- https://jumpcrypto.com/paradigms-for-on-chain-credit/
	- options protocols
		- cheapest set of options with a given delta, and min maturity on external protocols

- support bnb  testnet
	- https://docs.bnbchain.org/docs/BSCtestnet/
-support canto testnet
	- script to initalize udlfeeds
		- https://docs.scry.finance/docs/smart-contracts/solidity-contracts-and-interface
	- canto hedging
		- look at what beefy is doing with canto money markets
		- https://dexvaults.com/?chainFilter=%5B7700%5D&sortType=tvl&search=&tagsFilter=&profitFilter=&dexFiFilter=&vaultsType=ALL_VAULTS&smallTvl=false ???
		- yubari finance (perps)
		- https://nitter.lacontrevoie.fr/CION_FI (perps)

- support arbitrum
	- https://pyth.network/developers/price-feed-ids
	- deploy gmx fork or find gmx contracts on arbitrum

- non dollar-like stable deposits?
	- DepositHedgingManager
		- deposit
			- take collateral into exchange balance vault
			- open up delta-1 short
				- money markets (borrow untill neutral)
				- perps protocols
				- deep itm put options? (how to deal with expirations? map to general deposit outflows windows)
			- mint exchange balance to user
		- withdrawal
			- sell spot asset
			- close short
			- deposit net stables back into dod



- toggle pool
	- debug to make sure that related pool values are being added
		- make sure pool data is entering the state
		- have to toggle between two pools multiple times before something updates in the ui
		- other pool stats?

- manage pool
	- fast pool propsal
		- issue with governance (msg.sender isnt account but FPM contract)
			- vote yes on proposal
			- close proposal
		- avoid proposal contract creation with FPM when creating limit orders? (to save gas)
			- add pool manangment proposal functions to FPM?
				- can have many wrapers around same proposal addr?

https://forms.monday.com/forms/ce3817531bd3dcdba24e01e2263f397d?r=use1
https://docs.google.com/forms/d/e/1FAIpQLSe1_GGh_NArOi8_TcpmSjsNiDkLHINgb18dOewfQVWqcX8LWQ/viewform?usp=send_form


- pool governance
	- other proposal data?
	- info on pool risk


- protocol governance
	- other proposal data?
	- info on exchange risk


- hedging
	- different hedging strategies
		- gamma hedging model
		- theta hedging model
		- pool parameters that set how much which combination of parameters to automatically hedge
			- [0,0,0] -> [delta, gamma, theta]

- liquidlity pool contract
	- virtual methods for calcOptPrice
		- another set params variable that defines an external addr, if non zero
			- makes a static call to calcOptPrice defined on that addr?
			- percent payout from transfers taken from pool on buy/sell tx's for pools that are using the amm

- trade page
	- need to figure out how to list options in ui with the same functionality as existing
	- make a new trade page (trade v2)
		- toggle multiple options accross type
	- more info on profit and loss

- select/remove multiple options accross pools to buy/sell/compute collateral requirements for [later]			
- contract viewers helper
	- Reader		
		- udl feed addrs?
			- pull from government proposals?
			- pull from JSON

		- trade
			- make one unique strike per market but with a order book of diff prices?
			- sub query the pools that price a particalr option


https://wiki.polygon.technology/docs/zkEVM/develop/
https://v2-docs.zksync.io/api/hardhat/getting-started.html

//truffle deploy --network mumbai


Mumbai Testnet
Show more details
Pair 	Proxy
BTC / USD 	0x007A22900a3B98143368Bd5906f8E17e9867581b
DAI / USD 	0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046
ETH / USD 	0x0715A7794a1dc8e42615F059dD6e406A6594651A
EUR / USD 	0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A
LINK / MATIC 	0x12162c3E810393dEC01362aBf156D7ecf6159528
MATIC / USD 	0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
SAND / USD 	0x9dd18534b8f456557d11B9DDB14dA89b2e52e308
USDC / USD 	0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0
USDT / USD 	0x92C09849638959196E976289418e5973CC96d645

https://docs.chain.link/docs/data-feeds/price-feeds/addresses/


Smart contract bugs: https://nitter.lacontrevoie.fr/1nf0s3cpt/status/1583011233363824640

https://solvemymath.com/online_math_calculator/statistics/cdf_calculator.php


needs mods: https://github.com/1Hive/gardens/blob/master/packages/hardhat/contracts/GardensTemplate.sol
https://github.com/1Hive/token-manager-app/blob/master/contracts/HookedTokenManager.sol
https://github.com/1Hive/agreement-app/blob/master/contracts/Agreement.sol
https://github.com/Giveth/minime/blob/master/contracts/MiniMeToken.sol
https://github.com/1Hive/conviction-voting-app/blob/master/contracts/ConvictionVoting.sol


layer zero docs: https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses