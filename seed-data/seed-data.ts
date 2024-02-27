export const seedData = [
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#1" },
        sk: { S: "COMPANY#1" },
        address: { S: "12 York Gate London, NW1 4QS, UK" },
        annualRevenue: { S: "21600000" },
        companyName: { S: "Method Products Ltd" },
        ethicalScore: { N: "4" },
        website: { S: "https://www.methodproducts.co.uk" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#1" },
        sk: { S: "PRODUCT#0817939012390" },
        allProductsGSIPK: { S: "PRODUCT#ALL" },
        productName: { S: "Method All-Purpose Cleaner" },
        productDescription: { S: "Method All-Purpose Cleaner Spray, Plant-Based and Biodegradable Formula Perfect for Most Counters, Tiles, Stone, and More, 28 oz Spray Bottles" },
        productSort: { S: "2" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#2" },
        sk: { S: "COMPANY#2" },
        address: { S: "Astonish House, Unit 1, Premier point, Staithgate Lane, Bradford BD6 1DW, UK" },
        annualRevenue: { S: "27500000" },
        companyName: { S: "Astonish Holdings Ltd" },
        ethicalScore: { N: "12" },
        website: { S: "https://www.astonishcleaners.co.uk/" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#2" },
        sk: { S: "PRODUCT#0048256296181" },
        allProductsGSIPK: { S: "PRODUCT#ALL" },
        productName: { S: "Astonish Kitchen Cleaner" },
        productDescription: { S: "Astonish Zesty Lemon Scented Kitchen Cleaner - All Purpose Cleaning Solution Removes Grease, Grime, & Surface Stains - Cruelty Free Kitchen Grease And Multi Surface Cleaner - 750ml Spray Bottle" },
        productSort: { S: "1" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#3" },
        sk: { S: "COMPANY#3" },
        address: { S: "1 Coca-Cola Plaza NW Atlanta, GA 30313, USA" },
        annualRevenue: { S: "25000000000" },
        companyName: { S: "The Coca-Cola Company" },
        ethicalScore: { N: "1" },
        website: { S: "https://www.coca-colacompany.com/" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#3" },
        sk: { S: "PRODUCT#8901764012273" },
        allProductsGSIPK: { S: "PRODUCT#ALL" },
        productName: { S: "Coca-Cola Soda" },
        productDescription: { S: "Coca-Cola Original Taste - the refreshing, crisp taste you know and love, 16.9 FL OZ in each bottle" },
        productSort: { S: "4" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#4" },
        sk: { S: "COMPANY#4" },
        address: { S: "Timsons Business Centre, Bath Road, Kettering Northamptonshire NN16 8NQ, UK" },
        annualRevenue: { S: "80326" },
        companyName: { S: "Cawston Press Ltd" },
        ethicalScore: { N: "12" },
        website: { S: "https://cawstonpress.com/" }
      }
    }
  },
  {
    PutRequest: {
      Item: {
        pk: { S: "COMPANY#4" },
        sk: { S: "PRODUCT#0815796020008" },
        allProductsGSIPK: { S: "PRODUCT#ALL" },
        productName: { S: "Cawston Press Soft Drink" },
        productDescription: { S: "Cawston Press Sparkling Rhubarb & Apple Juice, 4 Packs, Sugar Free, 1320 ML" },
        productSort: { S: "3" }
      }
    }
  },
]