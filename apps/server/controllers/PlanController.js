const Plan = require('../models/planModel');
const User = require('../models/userModel');
const planTemplate = require('../utils/planTemplate');

exports.getPlanTemplate = [
  async (req, res) => {
    try {
      const { id } = req.query;
      const { planTemplate } = await User.findOne({ _id: id });
      res.send({
        planTemplate,
      });
    } catch (err) {
      res.send({
        err,
      });
    }
  },
];

exports.changePlanTemplate = [
  async (req, res) => {
    try {
      const { planList, id } = req.query;
      await User.updateOne({ _id: id }, { planTemplate: planList });
      res.send({
        msg: '每日计划更新成功！',
      });
    } catch (err) {
      res.send({
        err,
      });
    }
  },
];

exports.getPlan = [
  async (req, res) => {
    try {
      const { id, date } = req.query;
      const planList = await Plan.find({ id, date });
      res.send({
        planList,
      });
    } catch (err) {
      res.send({
        err,
      });
    }
  },
];

exports.addPlan = [
  async (req, res) => {
    try {
      const { id, date, planList } = req.body;
      planList.forEach(async (plan) => {
        await Plan.create({ ...plan });
      });
      const list = await Plan.find({ id, date });
      res.send({
        list,
      });
    } catch (err) {
      console.log(err);
      res.send({
        err,
      });
    }
  },
];

exports.updatePlan = [
  async (req, res) => {
    try {
      const { _id, completed, description } = req.body;
      if (typeof completed === 'undefined') {
        await Plan.updateOne({ _id }, { description });
      } else {
        await Plan.updateOne({ _id }, { completed });
      }
      const plan = await Plan.findOne({ _id });
      res.send({
        plan,
      });
    } catch (err) {
      res.send({
        err,
      });
    }
  },
];

exports.deletePlan = [
  async (req, res) => {
    try {
      const { _id } = req.body;
      await Plan.deleteOne({ _id });
      res.send({
        msg: '计划删除成功！',
      });
    } catch (err) {
      res.send({
        err,
      });
    }
  },
];
