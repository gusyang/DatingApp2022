using API.DTOs;
using API.Entites;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int Id);
        Task<AppUser> GetUseByUsernameAsync(string userName);  
        Task<MemberDto> GetMemberAsync(string userName);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams); 
    }
}