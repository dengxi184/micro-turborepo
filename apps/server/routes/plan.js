const express = require('express');
const PlanController = require('../controllers/PlanController');

const router = express.Router();

router.post(`/add-plans`, PlanController.addPlan);
router.delete(`/del-plan`, PlanController.deletePlan);
router.get(`/get-plans`, PlanController.getPlan);
router.get(`/get-plan-template`, PlanController.getPlanTemplate);
router.post(`/update-plan-template`, PlanController.changePlanTemplate);
router.post(`/update-plan`, PlanController.updatePlan);

module.exports = router;
