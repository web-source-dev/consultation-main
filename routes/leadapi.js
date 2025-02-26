const express = require('express');
const router = express.Router(); // Use Router instead of express()
const nodemailer = require('nodemailer');
require('dotenv').config(); // Use dotenv to manage environment variables

const Vendor = require('../models/Vendorform');
const Buyer = require('../models/Buyerform');
const sendEmail = require('../utils/email'); // Import sendEmail function

// Endpoint to handle Vendor form submission
router.post('/vendor', async (req, res) => {
  try {
    // Check if email already exists in Vendor collection
    const existingVendor = await Vendor.findOne({ email: req.body.email });
    if (existingVendor) {
      return res.status(400).send({ message: 'This email is already registered as a vendor.' });
    }

    // Check if email already exists in Buyer collection
    const existingBuyer = await Buyer.findOne({ email: req.body.email });
    if (existingBuyer) {
      return res.status(400).send({ message: 'This email is already registered as a buyer.' });
    }

    const vendor = new Vendor(req.body);
    await vendor.save();
    // Send vendor welcome email
    const vendorEmailText = `
      <html>
        <body>
          <h2>Welcome to Reachly – Set Up Your Vendor Dashboard</h2>
          <p>Dear ${vendor.firstName} ${vendor.lastName},</p>
          <p>Thank you for signing up with Reachly! We’re thrilled you’ve chosen us to help grow your business through high-quality, ready-to-buy leads. Your decision to work with us means you’re on the right path to predictable, scalable revenue.</p>
          <p>To get started, please set up your password and access your Vendor Dashboard, where you can:</p>
          <ul>
            <li>View your matched leads and their details</li>
            <li>Track your engagement history and responses</li>
            <li>Manage your preferences and account settings</li>
          </ul>
          <p>Click below to create your password and log in:</p>
          <p><a href="https://www.reachly.ca/vendor-dashboard-2">Set Up My Vendor Dashboard</a></p>
          <p>We look forward to helping you connect with qualified buyers and drive more revenue. If you have any questions, our team is always here to help at <a href="mailto:support@reachly.ca">support@reachly.ca</a>.</p>
          <p>Welcome aboard!</p>
          <p>The Reachly Team</p>
        </body>
      </html>
    `;
    const adminEmailText = `
  <html>
    <body>
      <h2>New Vendor Registration – Action Required</h2>
      <p>Dear Admin,</p>
      <p>We are pleased to inform you that a new vendor has successfully signed up on Reachly:</p>
      <ul>
        <li><strong>Name:</strong> ${vendor.firstName} ${vendor.lastName}</li>
        <li><strong>Email:</strong> ${vendor.email}</li>
        <li><strong>Company:</strong> ${vendor.companyName}</li>
        <li><strong>Sign-Up Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>As the admin, you are now responsible for reviewing the vendor's profile and assigning relevant leads to them. Please follow these next steps:</p>
    <ol>
      <li>Log into the admin dashboard to access the vendor’s profile.</li>
      <li>Review the matched leads that the platform has automatically assigned based on the vendor’s profile and preferences.</li>
      <li>Confirm the matched leads and ensure they are appropriate for the vendor.</li>
      <li>Assign the leads to the vendor so they can begin engaging with them through their dashboard.</li>
      <li>Verify that the vendor has proper access to their Vendor Dashboard and ensure their onboarding is complete.</li>
      </ol>
      <p>Once the leads are assigned, the vendor will be able to track and engage with them directly through their dashboard.</p>
      <p>If you have any internal questions or need to review the process further, please refer to the admin documentation or check the internal guidelines for lead assignment.</p>
      <p>Best regards,</p>
      <p>The Reachly Team</p>
    </body>
  </html>
`;


    await sendEmail(vendor.email.trim(), 'Welcome to Reachly – Set Up Your Vendor Dashboard', vendorEmailText);
    await sendEmail('contact@reachly.ca', 'New Vendor Registration - Admin Notification', adminEmailText);

    // Respond to the client only after emails are sent
    res.status(201).send({ message: 'Request submitted. Please check your email for further instructions.' });
  } catch (error) {
    // If there’s any error, respond with error message
    res.status(400).send({ error: 'Error submitting vendor form', details: error.message });
  }
});

router.post('/buyer', async (req, res) => {
  try {
    // Check if email already exists in Buyer collection
    const existingBuyer = await Buyer.findOne({ email: req.body.email });
    if (existingBuyer) {
      return res.status(400).send({ message: 'This email is already registered as a buyer.' });
    }

    // Check if email already exists in Vendor collection
    const existingVendor = await Vendor.findOne({ email: req.body.email });
    if (existingVendor) {
      return res.status(400).send({ message: 'This email is already registered as a vendor.' });
    }

    const buyer = new Buyer(req.body);
    await buyer.save();
    
    const buyerEmailText = `
      <html>
        <body>
          <h2>Welcome to Reachly! Connect with Top SaaS Vendors</h2>
          <p>Dear ${buyer.firstName},</p>
          <p>Thank you for signing up with Reachly! We’re excited to connect you with top SaaS vendors who can help elevate your business. By choosing Reachly, you gain direct access to pre-vetted solutions that align with your needs.</p>
          <p>To get started, create your password and log in to your Buyer Dashboard, where you can:</p>
          <ul>
            <li>View the vendors you’ve been matched with</li>
            <li>Access their contact details and proposals</li>
            <li>Track and manage your inquiries seamlessly</li>
          </ul>
          <p>Click below to create your password and access your dashboard:</p>
          <p><a href="https://www.reachly.ca/buyer-dashboard">Set Up My Buyer Dashboard</a></p>
          <p>We’re here to make your SaaS vendor selection process easier, faster, and more effective. If you have any questions, feel free to reach out at <a href="mailto:support@reachly.ca">support@reachly.ca</a>.</p>
          <p>We can’t wait to help you find the perfect solution!</p>
          <p>The Reachly Team</p>
        </body>
      </html>
    `;
    const adminBuyerEmailText = `
  <html>
    <body>
      <h2>New Buyer Registration – Action Required</h2>
      <p>Dear Admin,</p>
      <p>We are excited to inform you that a new buyer has successfully signed up on Reachly:</p>
      <ul>
        <li><strong>Name:</strong> ${buyer.firstName} ${buyer.lastName}</li>
        <li><strong>Email:</strong> ${buyer.email}</li>
        <li><strong>Company:</strong> ${buyer.companyName}</li>
        <li><strong>Sign-Up Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>As the admin, please review the buyer's profile and ensure that their preferences and requirements are properly recorded. This will help to ensure they are matched with the most relevant vendors.</p>
      <p>Once the buyer’s profile is reviewed, they will be automatically matched with the most suitable vendors based on their needs, and they can begin interacting with them via their Buyer Dashboard.</p>
      <p>Best regards,</p>
      <p>The Reachly Team</p>
    </body>
  </html>
`;

    await sendEmail('contact@reachly.ca', 'New Buyer Registration - Admin Notification', adminBuyerEmailText);
    
    await sendEmail(buyer.email, 'Welcome to Reachly! Connect with Top SaaS Vendors', buyerEmailText);
    
    // Respond to the client only after emails are sent
    res.status(201).send({ message: 'Request submitted. Please check your email for further instructions' });
  } catch (error) {
    // Handle any errors and send a detailed response
    res.status(400).send({ error: 'Error submitting buyer form', details: error.message });
  }
});


router.get('/getdata', async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    const buyers = await Buyer.find({});

    const matchedVendors = [];
    const notMatchedVendors = [];
    const matchedBuyers = [];
    const notMatchedBuyers = [];

    let totalMatchedVendors = 0;
    let totalNotMatchedVendors = 0;
    let totalMatchedBuyers = 0;
    let totalNotMatchedBuyers = 0;

    // Process vendors to find matched and unmatched buyers
    vendors.forEach((vendor) => {
      const matchedVendorBuyers = [];
      buyers.forEach((buyer) => {
        const matchReasons = [];

        // Check for industryMatch
        const matchedIndustries = vendor.selectedIndustries.filter(
          (industry) => buyer.industries.includes(industry)
        );

        if (matchedIndustries.length > 0) {
          // If industryMatches, check for serviceMatch
          const matchedServices = buyer.services
            .filter((buyerService) =>
              vendor.selectedServices.includes(buyerService.service)
            )
            .map((matchedService) => matchedService.service);

          if (matchedServices.length > 0) {
            matchReasons.push(
              `industryMatch: ${matchedIndustries.join(', ')}`,
              `serviceMatch: ${matchedServices.join(', ')}`
            );

            matchedVendorBuyers.push({
              buyer,
              matchReasons,
            });
          }
        }
      });

      if (matchedVendorBuyers.length > 0) {
        matchedVendors.push({
          vendor,
          matchedBuyers: matchedVendorBuyers,
        });
        totalMatchedVendors++;
      } else {
        notMatchedVendors.push(vendor);
        totalNotMatchedVendors++;
      }
    });

    // Process buyers to find matched and unmatched vendors
    buyers.forEach((buyer) => {
      const matchedBuyerVendors = [];
      vendors.forEach((vendor) => {
        const matchReasons = [];

        // Check for industryMatch
        const matchedIndustries = vendor.selectedIndustries.filter(
          (industry) => buyer.industries.includes(industry)
        );

        if (matchedIndustries.length > 0) {
          // If industryMatches, check for serviceMatch
          const matchedServices = buyer.services
            .filter((buyerService) =>
              vendor.selectedServices.includes(buyerService.service)
            )
            .map((matchedService) => matchedService.service);

          if (matchedServices.length > 0) {
            matchReasons.push(
              `industryMatch: ${matchedIndustries.join(', ')}`,
              `serviceMatch: ${matchedServices.join(', ')}`
            );

            matchedBuyerVendors.push({
              vendor,
              matchReasons,
            });
          }
        }
      });

      if (matchedBuyerVendors.length > 0) {
        matchedBuyers.push({
          buyer,
          matchedVendors: matchedBuyerVendors,
        });
        totalMatchedBuyers++;
      } else {
        notMatchedBuyers.push(buyer);
        totalNotMatchedBuyers++;
      }
    });

    // Send the response with total match counts
    res.send({
      buyer: {
        matched: matchedBuyers,
        notMatched: notMatchedBuyers,
        totalMatches: totalMatchedBuyers,
        totalNotMatched: totalNotMatchedBuyers,
      },
      vendor: {
        matched: matchedVendors,
        notMatched: notMatchedVendors,
        totalMatches: totalMatchedVendors,
        totalNotMatched: totalNotMatchedVendors,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error processing data', details: error });
  }
});
router.put('/vendor/:vendorEmail/match/:buyerEmail', async (req, res) => {
  const { vendorEmail, buyerEmail } = req.params;
  const { status } = req.body;

  try {
    const vendor = await Vendor.findOne({ email: vendorEmail }).populate('matchedBuyers.buyer');
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const buyer = await Buyer.findOne({ email: buyerEmail });
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Find if buyer is already in matchedBuyers list
    const matchIndex = vendor.matchedBuyers.findIndex(mb => mb.buyer._id.toString() === buyer._id.toString());

    if (matchIndex !== -1) {
      // ✅ Update status if the buyer is already in the list
      vendor.matchedBuyers[matchIndex].status = status;
    } else {
      // ✅ Add new matched buyer if not found
      vendor.matchedBuyers.push({ 
        buyer: buyer._id, 
        buyerEmail: buyer.email, 
        status 
      });
    }

    await vendor.save();
    res.json({ message: 'Match status updated successfully', matchedBuyers: vendor.matchedBuyers });

  } catch (error) {
    console.error('Error updating match status:', error); // Add error logging
    res.status(500).json({ error: 'Error updating match status', details: error.message });
  }
});


router.get('/vendor/:email/matches', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the vendor by email
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).send({ error: 'Vendor not found' });
    }

    // Find all buyers
    const buyers = await Buyer.find({});
    const matchedBuyers = [];

    buyers.forEach((buyer) => {
      const matchReasons = [];

      // Check for industryMatch
      const matchedIndustries = vendor.selectedIndustries.filter(
        (industry) => buyer.industries.includes(industry)
      );
      if (matchedIndustries.length > 0) {
        // Check for serviceMatch
        const matchedServices = buyer.services
          .filter((buyerService) =>
            vendor.selectedServices.includes(buyerService.service)
          )
          .map((matchedService) => matchedService.service);
        if (matchedServices.length > 0) {
          matchReasons.push(`industryMatch: ${matchedIndustries.join(', ')}`);
          matchReasons.push(`serviceMatch: ${matchedServices.join(', ')}`);
        }
      }

      // Add to matched buyers if there are match reasons
      if (matchReasons.length > 0) {
        matchedBuyers.push({
          buyer,
          matchReasons,
        });
      }
    });

    // Send the matched buyers along with the vendor data
    res.send({
      vendor,
      matchedBuyers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error processing data', details: error });
  }
});

router.get('/buyer/:email/matches', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the buyer by email
    const buyer = await Buyer.findOne({ email });

    if (!buyer) {
      return res.status(404).send({ error: 'Buyer not found' });
    }

    // Find all vendors
    const vendors = await Vendor.find({});
    const matchedVendors = [];

    vendors.forEach((vendor) => {
      const matchReasons = [];

      // Check for industryMatch
      const matchedIndustries = vendor.selectedIndustries.filter(
        (industry) => buyer.industries.includes(industry)
      );
      if (matchedIndustries.length > 0) {
        // Check for serviceMatch
        const matchedServices = buyer.services
          .filter((buyerService) =>
            vendor.selectedServices.includes(buyerService.service)
          )
          .map((matchedService) => matchedService.service);
        if (matchedServices.length > 0) {
          matchReasons.push(`industryMatch: ${matchedIndustries.join(', ')}`);
          matchReasons.push(`serviceMatch: ${matchedServices.join(', ')}`);
        }
      }

      // Add to matched vendors if there are match reasons
      if (matchReasons.length > 0) {
        matchedVendors.push({
          vendor,
          matchReasons,
        });
      }
    });

    // Send the matched vendors along with the buyer data
    res.send({
      buyer,
      matchedVendors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error processing data', details: error });
  }
});

// get all vendors 
router.get('/getAllVendors', async function (req, res) {
  try {
    const vendors = await Vendor.find({})
    const buyers = await Buyer.find({});
    const vendorData = vendors.map((vendor) => {
      const matchedBuyers = buyers
        .map((buyer) => {
          const matchReasons = [];

          // Check for industryMatch
          const matchedIndustries = vendor.selectedIndustries.filter(
            (industry) => buyer.industries.includes(industry)
          );
          if (matchedIndustries.length > 0) {
            // Check for serviceMatch
            const matchedServices = buyer.services
              .filter((buyerService) =>
                vendor.selectedServices.includes(buyerService.service)
              )
              .map((matchedService) => matchedService.service);
            if (matchedServices.length > 0) {
              matchReasons.push(`industryMatch: ${matchedIndustries.join(', ')}`);
              matchReasons.push(`serviceMatch: ${matchedServices.join(', ')}`);
            }
          }

          if (matchReasons.length > 0) {
            return {
              buyer,
              matchReasons,
            };
          }
          return null;
        })
        .filter((match) => match !== null);

      return {
        vendor,
        matchedBuyers,
      };
    });

    res.send({ msg: 'All Vendors Data', vendors: vendorData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching vendors', details: error });
  }
});

// get all buyers 
router.get('/getAllBuyers', async function (req, res) {
  try {
    const buyers = await Buyer.find({});
    const vendors = await Vendor.find({});
    const buyerData = buyers.map((buyer) => {
      const matchedVendors = vendors
        .map((vendor) => {
          const matchReasons = [];

          // Check for industryMatch
          const matchedIndustries = vendor.selectedIndustries.filter(
            (industry) => buyer.industries.includes(industry)
          );
          if (matchedIndustries.length > 0) {
            // Check for serviceMatch
            const matchedServices = buyer.services
              .filter((buyerService) =>
                vendor.selectedServices.includes(buyerService.service)
              )
              .map((matchedService) => matchedService.service);
            if (matchedServices.length > 0) {
              matchReasons.push(`industryMatch: ${matchedIndustries.join(', ')}`);
              matchReasons.push(`serviceMatch: ${matchedServices.join(', ')}`);
            }
          }

          if (matchReasons.length > 0) {
            return {
              vendor,
              matchReasons,
            };
          }
          return null;
        })
        .filter((match) => match !== null);

      return {
        ...buyer.toObject(),
        totalVendors: matchedVendors.length,
        matchedVendors,
      };
    });

    res.send({ msg: 'All Buyers Data', buyers: buyerData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching buyers', details: error });
  }
});

// update vendor data
router.put('/updateVendor/:email', async function (req, res) {
  const { email } = req.params;
  try {
    const vendor = await Vendor.findOne
    ({ email: email });
    if (!vendor) {
      return res.status(404).send({ error: 'Vendor not found' });
    }
    const updatedVendor = await Vendor
     .findOneAndUpdate(
        { email },
        {...req.body },
        { new: true }
      )
      //.populate('selectedServices.service')
      .exec();
      
    res.send({ msg: 'Vendor data updated successfully', vendor: updatedVendor });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error updating vendor data', details: error });
  }
}
);

// update buyer data
router.put('/updateBuyer/:email', async function (req, res) {
  const { email } = req.params;
  try {
    const buyer = await Buyer.findOne
    ({ email: email });
    if (!buyer) {
      return res.status(404).send({ error: 'Buyer not found' });
    }
    const updatedBuyer = await Buyer
     .findOneAndUpdate(
        { email },
        {...req.body },
        { new: true }
      )
      //.populate('selectedServices.service')
      .exec();
      
    res.send({ msg: 'Buyer data updated successfully', buyer: updatedBuyer });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error updating buyer data', details: error });
  }
}
);

// Endpoint to fetch vendor data by email
router.get('/vendor/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).send({ error: 'Vendor not found' });
    }
    res.send(vendor);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching vendor data', details: error.message });
  }
});

// Endpoint to fetch buyer data by email
router.get('/buyer/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(404).send({ error: 'Buyer not found' });
    }
    res.send(buyer);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching buyer data', details: error.message });
  }
});

router.get('/vendor/:email/match', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the vendor by email
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).send({ error: 'Vendor not found' });
    }

    // Find all buyers
    const buyers = await Buyer.find({});
    const matchedBuyers = [];

    buyers.forEach((buyer) => {
      const matchReasons = [];

      // Check for industryMatch
      const matchedIndustries = vendor.selectedIndustries.filter(
        (industry) => buyer.industries.includes(industry)
      );
      if (matchedIndustries.length > 0) {
        // Check for serviceMatch
        const matchedServices = buyer.services
          .filter((buyerService) =>
            vendor.selectedServices.includes(buyerService.service)
          )
          .map((matchedService) => matchedService.service);
        if (matchedServices.length > 0) {
          matchReasons.push(`industryMatch: ${matchedIndustries.join(', ')}`);
          matchReasons.push(`serviceMatch: ${matchedServices.join(', ')}`);
        }
      }

      // Add to matched buyers if there are match reasons and status is not changed
      const isStatusChanged = vendor.matchedBuyers.some(
        (matchedBuyer) => matchedBuyer.buyerEmail === buyer.email && matchedBuyer.status !== 'pending'
      );

      if (matchReasons.length > 0 && !isStatusChanged) {
        matchedBuyers.push({
          buyer,
          matchReasons,
        });
      }
    });

    // Send the matched buyers along with the vendor data
    res.send({
      vendor,
      matchedBuyers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error processing data', details: error });
  }
});


module.exports = router;
