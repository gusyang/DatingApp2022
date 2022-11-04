using System.Diagnostics;
using API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;
        public BuggyController(DataContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("Auth")]
        public ActionResult<string> GetSec()
        {   
            return "secur text";
            
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {   
            return _context.Users.Find(-1).ToString();            
        }
    }
}