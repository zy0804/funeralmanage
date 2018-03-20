/**
 * 查询盘点单界面对应的脚本
 */
var PageNum = 1;// 页数
var PageSize = 10;// 每页10条记录
var TotalPage = 1;// 总页数

/**
 * 创建XMLHttpRequest对象
 */
function createXMLHttpRequest()
{
	var XMLHttpReq = false;
	// 如果浏览器有XMLHttpRequest对象，则直接创建
	if (window.XMLHttpRequest)
	{
		XMLHttpReq = new XMLHttpRequest();
	}
	// 如果是ie浏览器
	else if (window.ActiveXObject)
	{
		try 
		{
			XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			XMLHttpReq = new ActiveObject("Microsoft.XMLHTTP");
		}
	}
	return XMLHttpReq;
}
	
/**
 * ajax提交请求
 */
function sendRequest(method, url, data, getResult)
{
	var result = "";
	// 创建XMLHttpRequest对象
	var XMLHttpReq = createXMLHttpRequest();
	if (method == "post")
	{
		// 打开连接
		XMLHttpReq.open("post", url, false);
		XMLHttpReq.setRequestHeader("content-type", "application/x-www-form-urlencoded");
		// 回调函数
		XMLHttpReq.onreadystatechange = function()
		{
			if(XMLHttpReq.readyState == 4)
 	 		{
 	 		 	//返回成功；
 	 		 	if(XMLHttpReq.status == 200)
 	 		 	{
 	 		 		result = XMLHttpReq.responseText;
 	 		 		getResult(result);
 	 		 	}
 	 		}
		}
		// 发送数据
		XMLHttpReq.send(data.toString());
	}
}

/**
 * 页面加载时触发该事件
 */
window.onload = function()
{
	var pageNum = 1;
	// 获取第一页的盘点单记录
	getWarehouseChecks(pageNum);
};

/**
 * 获取当前页的盘点记录
 * @param pageNum 当前页数
 */
function getWarehouseChecks(pageNum)
{
	var staffName = document.getElementById("staffName");// 业务人员
	var startTime = document.getElementById("startTime");// 开始日期
	var endTime = document.getElementById("endTime");// 截止日期
	var warehouseName = document.getElementById("warehouseName");// 销售仓库
	PageNum = pageNum;
	var data = "";
	var data1 = "";
	var url = "";
	var url1 = "";
	data = "staffName=" + staffName.value + "&startTime=" + startTime.value + "&endTime=" + endTime.value
		+ "&warehouseName=" + warehouseName.value + "&pageNum=" + PageNum + "&pageSize=" + PageSize;
	data1 = "staffName=" + staffName.value + "&startTime=" + startTime.value + "&endTime=" + endTime.value	
		+ "&warehouseName=" + warehouseName.value + "&pageSize=" + PageSize;
	url = "/FuneralManageSystem/queryWarehouseCheck!getWarehouseChecks";
	url1 = "/FuneralManageSystem/queryWarehouseCheck!getPageCount";
	sendRequest("post", url, data, getWarehouseChecksBack);
	sendRequest("post", url1, data1, getPageCountBack);
}

/**
 * 返回盘点记录
 * @param result
 */
function getWarehouseChecksBack(result)
{
	// 清空表格
	deleteTable();
	var table = document.getElementById("table");// 表格
	var data = eval("(" + eval("(" + result + ")") + ")");
	if (data.length == 0)
	{
		var tr = table.insertRow();
		var td1 = tr.insertCell();
		td1.setAttribute("colspan", "6");
		td1.style.cssText="text-align:center";
		td1.innerHTML = "0条记录！";
	}
	else
	{
		// 遍历销售单记录
		for (var i = 0; i < data.length; i++)
		{
			var tr = table.insertRow();
			var td1 = tr.insertCell();
			var td2 = tr.insertCell();
			var td3 = tr.insertCell();
			var td4 = tr.insertCell();
			var td5 = tr.insertCell();
			var td6 = tr.insertCell();
			td1.innerHTML = data[i].warehouseCheckNumber;
			td2.innerHTML = data[i].staffName;
			td3.innerHTML = data[i].checkDate.substring(0, data[i].checkDate.length - 5);
			td4.innerHTML = data[i].warehouseName;
			td5.innerHTML = "<input type='button' value='修改' onclick='updateWarehouseCheck(this);'/>";
			td5.align = "center";
			td6.innerHTML = "<input type='button' value='删除' onclick='deleteWarehouseCheck(this);'/>";
			td6.align = "center";
		}
	}
}

/**
 * 获取分页结果
 * @param result
 */
function getPageCountBack(result)
{
	var page = document.getElementById("page");// 分页显示区
	TotalPage = eval("(" + eval("(" + result + ")") + ")");
	page.innerHTML = GetPaging(PageNum, TotalPage, "getWarehouseChecks");
}

/**
 * 清空表格
 */
function deleteTable()
{
	var table = document.getElementById("table");// 表格
	// 除第一行其它行都删除
	for (var i = table.rows.length - 1; i>=1; i--)
	{
		table.deleteRow(i);
	}
}

/**
 * 点击“查询”按钮触发该事件
 */
function searchWarehouseCheck()
{
	var pageNum = 1;
	// 查询当前页盘点单信息
	getWarehouseChecks(pageNum);
}

/**
 * 修改盘点单
 * @param obj
 */
function updateWarehouseCheck(obj)
{
	var warehouseCheckNumber = obj.parentNode.parentNode.cells[0].innerHTML;// 盘点单号
	window.parent.location.reload("warehouseCheckManage.jsp?type=update&warehouseCheckNumber=" + warehouseCheckNumber);
}

/**
 * 删除盘点单
 * @param obj
 */
function deleteWarehouseCheck(obj)
{
	var warehouseCheckNumber = obj.parentNode.parentNode.cells[0].innerHTML;// 盘点单号
	window.parent.location.reload("warehouseCheckManage.jsp?type=delete&warehouseCheckNumber=" + warehouseCheckNumber);
}