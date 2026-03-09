import type { CompanyDetail } from "../../types";

export const companyDetails: Record<number, CompanyDetail> = {
  1: {
    description:
      "메모리와 시스템LSI 인접 조직에서 RTL 설계, 통합, 성능 검증 범위가 넓은 포지션입니다.",
    roleDescription:
      "블록 단위 RTL 설계, 타이밍 클로저 협업, SystemVerilog 기반 검증 경험을 강하게 요구합니다.",
    techStack: ["Verilog", "SystemVerilog", "UVM", "AMBA AXI", "SpyGlass", "PrimeTime"],
    news: [
      "AI 서버와 모바일 반도체 로드맵 확대로 RTL 채용 수요가 이어지고 있습니다.",
      "컨트롤러와 인터커넥트 IP 경험이 있으면 서류 경쟁력이 높아집니다.",
    ],
  },
  2: {
    description:
      "메모리 컨트롤러와 고속 인터페이스 설계에 강한 적합도를 보이는 기업입니다.",
    roleDescription:
      "컨트롤러 RTL, 성능 분석, FPGA bring-up 경험을 수치와 결과 중심으로 설명하면 좋습니다.",
    techStack: ["SystemVerilog", "Python", "DDR", "HBM", "FPGA", "Performance modeling"],
    news: [
      "HBM 확장 기조로 컨트롤러와 검증 인력 수요가 계속 유지되고 있습니다.",
      "아키텍처 이해와 검증 자동화 경험을 같이 보는 편입니다.",
    ],
  },
  3: {
    description:
      "디스플레이와 복합 신호 인접 SoC 프로젝트 비중이 높아 문서화와 협업 역량도 중요합니다.",
    roleDescription:
      "디스플레이 컨트롤러 또는 인터페이스 RTL, 검증 계획, 저전력 설계 경험을 중요하게 봅니다.",
    techStack: ["Verilog", "Display pipeline", "MIPI", "Low-power design"],
    news: [
      "자동차 디스플레이 제품군 확대로 검증 복잡도가 계속 올라가고 있습니다.",
      "면접에서는 구체적인 디버깅 사례를 중요하게 묻는 편입니다.",
    ],
  },
  4: {
    description:
      "AI 가속기 스타트업 특성상 RTL 깊이뿐 아니라 아키텍처 문맥과 실행 속도를 함께 봅니다.",
    roleDescription:
      "NPU 데이터패스와 인터커넥트 RTL, 빠른 검증 루프, 높은 오너십이 중요한 포지션입니다.",
    techStack: ["RTL", "SystemC", "Python", "NPU architecture", "Performance analysis"],
    news: [
      "코딩 깊이 외에도 아키텍처 이해를 강하게 요구하는 편입니다.",
      "처리량이나 효율 개선을 수치로 보여주는 사례가 특히 유리합니다.",
    ],
  },
  5: {
    description:
      "자동차 멀티미디어 제어 SoC 계열로 일정이 비교적 안정적이고 프로토콜 검증 경험과 잘 맞습니다.",
    roleDescription:
      "서브시스템 통합, 규격 적합성 검증, 디버깅 커뮤니케이션 역량을 설명할 수 있어야 합니다.",
    techStack: ["ARM AMBA", "PCIe", "MIPI", "SystemVerilog", "Automotive SoC"],
    news: [
      "차량용 인포테인먼트 SoC 확장으로 인터페이스 검증 수요가 이어지고 있습니다.",
      "일정 관리와 커뮤니케이션 방식도 면접에서 중요하게 봅니다.",
    ],
  },
  6: {
    description:
      "SSD 컨트롤러 중심 환경으로 데이터 경로 설계와 성능 관점을 함께 설명할 수 있으면 좋습니다.",
    roleDescription:
      "스토리지 컨트롤러 로직, 테스트 분류 정렬, 데이터패스 검증 경험과 잘 맞습니다.",
    techStack: ["Controller RTL", "DMA", "NAND", "PCIe", "SystemVerilog"],
    news: [
      "디버깅 로그와 기술 문서 정리 능력을 계속 보는 편입니다.",
      "이슈 추적과 원인 정리 경험이 있으면 차별화됩니다.",
    ],
  },
};
