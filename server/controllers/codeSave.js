const CodeSave=require("../models/codeSave");

async function codeSave(req,res){
    const { id, code } = req.body;
    await CodeSave.findOneAndUpdate({ id }, { code }, { upsert: true });
    res.json({ success: true });
};

async function codeRetrive(req,res){
    const codeData = await CodeSave.findOne({ id: req.params.id });
    res.json({ code: codeData ? codeData.code : '' });
};

module.exports={
    codeSave,
    codeRetrive
}