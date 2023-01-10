namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 10;
        public int PageNumber { get; set; } = 1;
    
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
        }
        public string CurrentUsername { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 19;
        public int MaxAge { get; set; } = 100;
        public string OrderBy { get; set; } = "lastActive";
        
    }
}